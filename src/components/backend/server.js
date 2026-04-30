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

app.get("/", (req, res) => {
  res.json({ message: "SmartFlow API fonctionne ! ✅" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});