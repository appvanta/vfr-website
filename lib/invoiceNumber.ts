import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const COUNTER_FILE = path.join(process.cwd(), "invoices", ".counter.json");

const PREFIX = process.env.INVOICE_PREFIX ?? "VFR-";
const START = Number(process.env.INVOICE_START_NUMBER ?? "10001");

async function readCounter(): Promise<number> {
  try {
    const raw = await fs.readFile(COUNTER_FILE, "utf8");
    const { next } = JSON.parse(raw) as { next: number };
    return next;
  } catch {
    return START;
  }
}

async function writeCounter(next: number) {
  await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
  await fs.writeFile(COUNTER_FILE, JSON.stringify({ next }), "utf8");
}

/**
 * Atomares Hochzählen der Rechnungsnummer.
 * HINWEIS: In Produktion (mehrere Instanzen / Serverless) sollte das durch eine
 * echte DB (Postgres/SQLite) oder einen externen Counter ersetzt werden.
 */
export async function nextInvoiceNumber(): Promise<string> {
  const current = await readCounter();
  await writeCounter(current + 1);
  const year = new Date().getFullYear();
  return `${PREFIX}${year}-${current}`;
}
