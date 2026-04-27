const express    = require("express");
const router     = express.Router();
const nodemailer = require("nodemailer");

const {
  register,
  login,
  getProfile,
  getAllUsers,
  soumettreCandidature,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/auth");

// ── Routes PUBLIQUES (pas besoin d'être connecté) ──
router.post("/register", register);
router.post("/login",    login);

// ── Routes PROTÉGÉES (faut être connecté) ──
router.get("/profile",       protect, getProfile);
router.post("/candidatures", protect, soumettreCandidature);

// ── Routes ADMIN (faut être admin) ──
router.get("/all", protect, adminOnly, getAllUsers);

// ══════════════════════════════════════════
// ★ ROUTE ENVOI EMAIL — ajoutée ici ★
// ══════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    
user: process.env.GMAIL_USER,
pass: process.env.GMAIL_PASS,
  },
});

router.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ success: false, message: "Champs manquants" });
  }
  try {
    await transporter.sendMail({
      
from: `"SmartFlow Outsourcing" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: body,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email :", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;