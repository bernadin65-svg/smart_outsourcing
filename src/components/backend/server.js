const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://externalisation-bpo.vercel.app"],
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);

// ── Route Email ContactUs (Resend → vous uniquement, OK) ──
app.post("/api/send", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    "SmartFlow Outsourcing <onboarding@resend.dev>",
      to:      ["ybernadin65@gmail.com"],
      replyTo: email,
      subject: subject,
      html: `<p><b>De :</b> ${name} (${email})</p><p>${message}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur Resend:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Route Email Utilisateur (Brevo → n'importe quel email) ──
app.post("/api/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key":      process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender:      { name: "SmartFlow Outsourcing", email: "ybernadin65@gmail.com" },
        to:          [{ email: email, name: name }],
        subject:     subject,
        htmlContent: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Erreur Brevo:", JSON.stringify(err));
      return res.status(500).json({ success: false, message: err.message });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur Brevo:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "SmartFlow API fonctionne ! ✅" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});