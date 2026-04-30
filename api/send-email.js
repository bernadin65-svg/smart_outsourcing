import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, subject, message } = req.body;

  try {
    await resend.emails.send({
      from:    'SmartFlow Outsourcing <onboarding@resend.dev>',
      to:      ['ybernadin65@gmail.com'],
      replyTo: email,
      subject: subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px;">
          <div style="background:#0c1220;padding:24px;border-radius:10px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#60a5fa;font-size:20px;margin:0;">SmartFlow Outsourcing</h1>
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:6px 0 0;">Plateforme BPO de référence à Madagascar</p>
          </div>
          <div style="background:#ffffff;padding:28px;border-radius:10px;border:1px solid #e5e7eb;">
            <p style="font-family:Arial,sans-serif;font-size:13px;color:#6b7280;margin:0 0 12px;">De : <strong>${name}</strong> &lt;${email}&gt;</p>
            <pre style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;white-space:pre-wrap;line-height:1.7;margin:0;">${message}</pre>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:20px;">
            © ${new Date().getFullYear()} SmartFlow Outsourcing · Madagascar · Antsiranana
          </p>
        </div>
      `,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur Resend:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}