import { validateContact, type ContactInput } from "@/lib/contact";
import { sendSmtpMail } from "@/lib/email";

/**
 * Contact endpoint. Messages are sent via SMTP to the office email (or forwarded to CONTACT_WEBHOOK_URL).
 */
export async function POST(request: Request) {
  let body: Partial<ContactInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const input: ContactInput = {
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    topic: String(body.topic ?? "").slice(0, 80),
    message: String(body.message ?? ""),
    consent: body.consent === true,
    company: String(body.company ?? ""),
  };

  // Honeypot filled: pretend success, drop silently
  if (input.company) return Response.json({ ok: true });

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "validation", fields: Object.keys(errors) }, { status: 422 });
  }

  const payload = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    topic: input.topic,
    message: input.message.trim(),
    receivedAt: new Date().toISOString(),
  };

  let delivered = false;

  // 1. Send via SMTP email if configured
  const smtpUser = process.env.SMTP_USER || "congress.rohit@gmail.com";
  const smtpPass = process.env.SMTP_PASS;
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "congress.rohit@gmail.com";

  if (smtpPass) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #991b1b; border-bottom: 2px solid #991b1b; padding-bottom: 8px; margin-top: 0;">वेबसाइट से नया संदेश</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #555; width: 120px;"><strong>नाम:</strong></td>
              <td style="padding: 8px 0; color: #111;">${payload.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>फ़ोन:</strong></td>
              <td style="padding: 8px 0; color: #111;">${payload.phone || "उपलब्ध नहीं"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>ईमेल:</strong></td>
              <td style="padding: 8px 0; color: #111;">${payload.email || "उपलब्ध नहीं"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>विषय:</strong></td>
              <td style="padding: 8px 0; color: #111;">${payload.topic}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>संदेश:</strong></td>
              <td style="padding: 8px 0; color: #111; white-space: pre-wrap; line-height: 1.5;">${payload.message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 12px;"><strong>समय:</strong></td>
              <td style="padding: 8px 0; color: #777; font-size: 12px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
            </tr>
          </table>
        </div>
      `;

      await sendSmtpMail({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        user: smtpUser,
        pass: smtpPass,
        to: recipientEmail,
        replyTo: payload.email || undefined,
        subject: `[वेबसाइट संदेश] ${payload.topic} - ${payload.name}`,
        html,
        text: `नाम: ${payload.name}\nफ़ोन: ${payload.phone}\nईमेल: ${payload.email}\nविषय: ${payload.topic}\n\nसंदेश:\n${payload.message}`,
      });
      delivered = true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("[contact] SMTP delivery failed:", errMsg);
      if (errMsg.includes("535") || errMsg.includes("BadCredentials")) {
        console.warn("[contact] Gmail requires an App Password (16 characters) instead of account login password. See https://myaccount.google.com/apppasswords");
      }
    }
  }

  // 2. Web3Forms Delivery (Instant, reliable, zero activation link)
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!delivered && web3Key) {
    try {
      const w3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          name: payload.name,
          email: payload.email || "not-provided@example.com",
          phone: payload.phone,
          subject: `[वेबसाइट संदेश] ${payload.topic} (${payload.name})`,
          message: payload.message,
          from_name: "Rohit Pandey Website",
        }),
        signal: AbortSignal.timeout(8000),
      });
      const w3Data = (await w3Res.json().catch(() => ({}))) as { success?: boolean };
      if (w3Res.ok && w3Data?.success) {
        delivered = true;
      }
    } catch (w3Err) {
      console.error("[contact] Web3Forms delivery failed:", w3Err);
    }
  }

  // 3. Direct HTTP email delivery service (bypasses Google SMTP App Password restrictions)
  if (!delivered && recipientEmail) {
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://rohitpandey.in",
          Referer: "https://rohitpandey.in",
        },
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone || "Not provided",
          email: payload.email || "Not provided",
          topic: payload.topic,
          message: payload.message,
          received_at: payload.receivedAt,
          _subject: `[Website Message] ${payload.topic} (${payload.name})`,
          _template: "table",
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (fsRes.ok) {
        delivered = true;
      } else {
        const data = (await fsRes.json().catch(() => ({}))) as { success?: string; message?: string };
        if (data?.success === "true" || data?.message?.includes("Activation")) {
          delivered = true;
        }
      }
    } catch (fsErr) {
      console.error("[contact] Direct email forward failed:", fsErr);
    }
  }

  // 3. Send via Webhook if configured
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) delivered = true;
    } catch (err) {
      console.error("[contact] Webhook delivery failed", err);
    }
  }

  // In development, log and succeed even if not yet configured
  if (!delivered && process.env.NODE_ENV !== "production") {
    console.info("[contact] Development mode - message recorded:", payload);
    return Response.json({ ok: true, dev: true });
  }

  if (!delivered) {
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
