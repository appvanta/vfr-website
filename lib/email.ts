import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.MAIL_FROM ?? "VFR <buchung@vfr-gmbh.de>";
const REPLY_TO = process.env.MAIL_REPLY_TO ?? "info@vfr-gmbh.de";
const BCC = process.env.MAIL_BCC_INTERNAL;

export type EmailAttachment = {
  filename: string;
  content: Buffer | string;
};

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  bcc?: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set, skipping send:", opts.subject);
    return { id: "noop", queued: false };
  }
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    replyTo: REPLY_TO,
    bcc: opts.bcc ?? BCC,
    subject: opts.subject,
    html: opts.html,
    attachments: opts.attachments?.map((a) => ({
      filename: a.filename,
      content: typeof a.content === "string" ? a.content : a.content.toString("base64"),
    })),
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
  return { id: data?.id ?? "ok", queued: true };
}
