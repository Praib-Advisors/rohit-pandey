import tls from "tls";

export type EmailOptions = {
  host?: string;
  port?: number;
  user: string;
  pass: string;
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
};

/**
 * Lightweight native TLS SMTP client without external dependencies.
 * Works out-of-the-box with Gmail, Brevo, SendGrid or any standard TLS SMTP server.
 */
export function sendSmtpMail(options: EmailOptions): Promise<{ ok: boolean; response: string }> {
  const {
    host = "smtp.gmail.com",
    port = 465,
    user,
    pass,
    to,
    from,
    replyTo,
    subject,
    html,
    text,
  } = options;

  return new Promise((resolve, reject) => {
    let resolved = false;
    const socket = tls.connect(port, host, { rejectUnauthorized: true }, () => {});
    socket.setEncoding("utf8");

    let buffer = "";
    const send = (cmd: string) => {
      socket.write(`${cmd}\r\n`);
    };

    let step = 0;

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split("\r\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line) continue;
        const code = parseInt(line.slice(0, 3), 10);
        // Multi-line SMTP response: line[3] is '-'
        if (line[3] === "-") continue;

        if (step === 0 && code === 220) {
          step = 1;
          send("EHLO localhost");
        } else if (step === 1 && code === 250) {
          step = 2;
          send("AUTH LOGIN");
        } else if (step === 2 && code === 334) {
          step = 3;
          send(Buffer.from(user).toString("base64"));
        } else if (step === 3 && code === 334) {
          step = 4;
          send(Buffer.from(pass.replace(/\s+/g, "")).toString("base64"));
        } else if (step === 4) {
          if (code === 235) {
            step = 5;
            send(`MAIL FROM:<${from || user}>`);
          } else {
            resolved = true;
            socket.end("QUIT\r\n");
            return reject(new Error(`SMTP Auth Failed: ${line}`));
          }
        } else if (step === 5 && code === 250) {
          step = 6;
          send(`RCPT TO:<${to}>`);
        } else if (step === 6 && code === 250) {
          step = 7;
          send("DATA");
        } else if (step === 7 && code === 354) {
          step = 8;
          const subjectB64 = Buffer.from(subject).toString("base64");
          const bodyContent = html || text || "";
          const emailData = [
            `From: "Rohit Pandey Website" <${from || user}>`,
            `To: <${to}>`,
            replyTo ? `Reply-To: ${replyTo}` : "",
            `Subject: =?UTF-8?B?${subjectB64}?=`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: base64`,
            "",
            Buffer.from(bodyContent).toString("base64"),
            ".",
          ]
            .filter((l) => l !== "")
            .join("\r\n");

          send(emailData);
        } else if (step === 8 && code === 250) {
          step = 9;
          resolved = true;
          send("QUIT");
          resolve({ ok: true, response: line });
        }
      }
    });

    socket.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    socket.on("end", () => {
      if (!resolved) {
        resolved = true;
        reject(new Error(`SMTP connection closed prematurely at step ${step}`));
      }
    });

    socket.setTimeout(12000, () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        reject(new Error("SMTP connection timed out"));
      }
    });
  });
}

