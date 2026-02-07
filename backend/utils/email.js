import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendVerificationEmail({ to, otp, expiresMinutes }) {
  const from = process.env.EMAIL_FROM;
  const transport = getTransporter();

  if (!from || !transport) {
    console.warn("Email not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/EMAIL_FROM to send emails.");
    return false;
  }

  const subject = "Your MedAI verification code";
  const ttlText = typeof expiresMinutes === "number" ? `${expiresMinutes} minutes` : "10 minutes";
  const text = `Your verification code is ${otp}. It expires in ${ttlText}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Verify your MedAI account</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</div>
      <p>This code expires in ${ttlText}.</p>
    </div>
  `;

  await transport.sendMail({ from, to, subject, text, html });
  return true;
}
