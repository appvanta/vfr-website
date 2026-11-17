"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";

type Message = {
  role: "user" | "assistant" | "agent";
  content: string;
  agentName?: string;
};

const STORAGE_KEY = "vfr-chat-history-v2";
const SESSION_KEY = "vfr-chat-session-id";
const POLL_INTERVAL_MS = 5000;

const WELCOME =
  "Hallo! Ich bin der VFR-Assistent. Frag mich zu Ausbildung, Fortbildung, Förderung, Preisen und Terminen. Bei Bedarf übernimmt ein echter Mitarbeiter aus unserem Büro.";

function makeSessionId(): string {
  const existing = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
  if (existing) return existing;
  const id =
    "sess_" +
    (crypto.randomUUID?.() ??
      Math.random().toString(36).slice(2) + Date.now().toString(36));
  if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, id);
  return id;
}

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [humanTakeover, setHumanTakeover] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastPollAt = useRef<string>(new Date(0).toISOString());

  // Mount: SessionId + History laden
  useEffect(() => {
    setSessionId(makeSessionId());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { messages?: Message[]; humanTakeover?: boolean };
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.humanTakeover) setHumanTakeover(parsed.humanTakeover);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, humanTakeover }),
      );
    } catch {}
  }, [messages, humanTakeover]);

  // Scroll zu neuestem Eintrag
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  // Focus
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Polling für Agent-Nachrichten — nur wenn Chat offen und Session existiert
  useEffect(() => {
    if (!sessionId || !open) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(
          `/api/chat?sessionId=${encodeURIComponent(sessionId)}&since=${encodeURIComponent(lastPollAt.current)}`,
        );
        const json = await res.json();
        if (cancelled) return;
        if (json.humanTakeover) setHumanTakeover(true);
        if (Array.isArray(json.newMessages) && json.newMessages.length > 0) {
          setMessages((prev) => [
            ...prev,
            ...json.newMessages.map(
              (m: { content: string; agentName?: string }) => ({
                role: "agent" as const,
                content: m.content,
                agentName: m.agentName,
              }),
            ),
          ]);
          lastPollAt.current = new Date().toISOString();
        }
      } catch {}
    };
    tick();
    const iv = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [sessionId, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading || !sessionId) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          context: {
            page: typeof window !== "undefined" ? window.location.pathname : undefined,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
            referrer: typeof document !== "undefined" ? document.referrer : undefined,
          },
        }),
      });
      const json = await res.json();
      if (json.humanTakeover) setHumanTakeover(true);
      if (json.reply) {
        setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
      } else if (json.info) {
        setMessages((m) => [...m, { role: "assistant", content: json.info }]);
      } else if (json.error) {
        setMessages((m) => [...m, { role: "assistant", content: json.error }]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Hier ist leider etwas schiefgelaufen. Ruf uns an: +49 2208 919 626-0 oder schreib an info@vfr-gmbh.de.",
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Verbindung unterbrochen. Bitte nochmal versuchen oder uns direkt anrufen: +49 2208 919 626-0.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setHumanTakeover(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    setSessionId(makeSessionId());
  }

  const displayMessages: Message[] = [
    { role: "assistant", content: WELCOME },
    ...messages,
  ];

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-50 left-5 bottom-20 sm:bottom-5 bg-[var(--vfr-accent)] text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 py-3 pl-4 pr-5 group"
          aria-label="Chat öffnen"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold text-[0.9rem] hidden sm:inline">
            Frag uns
          </span>
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
          />
        </button>
      )}

      {open && (
        <div
          className="fixed z-50 inset-x-3 bottom-20 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[380px] h-[70vh] sm:h-[560px] max-h-[640px] bg-white rounded-xl shadow-2xl border border-[var(--vfr-rule)] flex flex-col overflow-hidden"
          role="dialog"
          aria-label="VFR-Chat"
        >
          <div
            className={`flex items-center justify-between gap-3 text-white px-4 py-3 transition-colors ${
              humanTakeover ? "bg-emerald-700" : "bg-[var(--vfr-topbar)]"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                {humanTakeover ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div>
                <div className="font-semibold text-[0.9rem] leading-tight">
                  {humanTakeover ? "VFR-Büro" : "VFR-Assistent"}
                </div>
                <div className="text-[0.7rem] opacity-80 leading-tight">
                  {humanTakeover
                    ? "Ein Mitarbeiter betreut dich jetzt"
                    : "Antwortet meist in Sekunden"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[0.75rem] opacity-80 hover:opacity-100 px-2 py-1"
                  title="Chat löschen"
                >
                  Zurücksetzen
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="opacity-80 hover:opacity-100 p-1"
                aria-label="Chat schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--vfr-bg-alt)]"
          >
            {displayMessages.map((m, i) => (
              <ChatMessageBubble key={i} m={m} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[var(--vfr-rule)] text-[var(--vfr-fg-muted)] px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2 text-[0.85rem]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {humanTakeover ? "Büro tippt …" : "denkt nach …"}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 border-t border-[var(--vfr-rule)] p-3 bg-white"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Deine Frage …"
              className="flex-1 border border-[var(--vfr-rule)] rounded-xl px-3 py-2 text-[0.92rem] focus:outline-2 focus:outline-[var(--vfr-accent)] resize-none max-h-32 min-h-[42px]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[var(--vfr-accent)] text-white p-2.5 rounded-full hover:bg-[var(--vfr-accent-dark)] transition disabled:opacity-40 shrink-0"
              aria-label="Senden"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="text-[0.7rem] text-[var(--vfr-fg-soft)] px-4 pb-2 bg-white text-center">
            {humanTakeover
              ? "Du chattest mit einem Mitarbeiter aus unserem Büro."
              : "KI-Antworten können fehlerhaft sein. Bei Rechtsfragen bitte Beratungstermin."}
          </div>
        </div>
      )}
    </>
  );
}

function ChatMessageBubble({ m }: { m: Message }) {
  const isUser = m.role === "user";
  const isAgent = m.role === "agent";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        {isAgent && (
          <div className="text-[0.7rem] font-semibold text-emerald-700 mb-1 flex items-center gap-1">
            <User className="h-3 w-3" />
            {m.agentName ?? "VFR-Büro"}
          </div>
        )}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[0.9rem] leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-[var(--vfr-accent)] text-white rounded-br-sm"
              : isAgent
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-bl-sm"
                : "bg-white border border-[var(--vfr-rule)] text-[var(--vfr-fg)] rounded-bl-sm"
          }`}
        >
          {m.content}
        </div>
      </div>
    </div>
  );
}
