import { NextResponse } from "next/server";
import { _mockAgentReply } from "@/lib/flario";

/**
 * NUR DEV: simuliert eine Agent-Antwort in einer bestehenden Chat-Session.
 * Nicht in Produktion. Wird vom Flario-Backend durch echten API-Endpoint
 * ersetzt (POST /chat-sessions/:id/messages mit role=agent).
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "dev only" }, { status: 404 });
  }
  const body = (await req.json()) as {
    sessionId: string;
    content: string;
    agentName?: string;
  };
  if (!body.sessionId || !body.content) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }
  _mockAgentReply(body.sessionId, body.content, body.agentName);
  return NextResponse.json({ ok: true });
}
