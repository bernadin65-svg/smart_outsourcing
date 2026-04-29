const db         = require("../config/db");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ── Transporter Nodemailer ── CORRIGÉ : force IPv4
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ════════════════════════════════════════
//  INSCRIPTION
// ════════════════════════════════════════
exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const hashed = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      `INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)`,
      [nom, prenom, email, hashed]
    );

    res.status(201).json({
      message: "Compte créé avec succès !",
      userId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  CONNEXION
// ════════════════════════════════════════
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie !",
      token,
      user: {
        id:     user.id,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  ENVOYER UN EMAIL TRANSACTIONNEL
// ════════════════════════════════════════
exports.sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ success: false, message: "Champs to, subject et body requis." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ success: false, message: "Adresse e-mail invalide." });
  }

  try {
    await transporter.sendMail({
      from:    `"SmartFlow Outsourcing" <${process.env.GMAIL_USER}>`,
      to:      to,
      subject: subject,
      text:    body,
      html:    `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px;">
          <div style="background:#0c1220;padding:24px;border-radius:10px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#60a5fa;font-size:20px;margin:0;">SmartFlow Outsourcing</h1>
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:6px 0 0;">Plateforme BPO de référence à Madagascar</p>
          </div>
          <div style="background:#ffffff;padding:28px;border-radius:10px;border:1px solid #e5e7eb;">
            <pre style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;white-space:pre-wrap;line-height:1.7;margin:0;">${body}</pre>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:20px;">
            © ${new Date().getFullYear()} SmartFlow Outsourcing · Madagascar · Antsiranana
          </p>
        </div>
      `,
    });

    console.log(`✅ Email envoyé à : ${to} | Sujet : ${subject}`);
    res.json({ success: true, message: "Email envoyé avec succès." });

  } catch (err) {
    console.error("❌ Erreur envoi email :", err.message);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
  }
};

// ════════════════════════════════════════
//  SOUMETTRE UNE CANDIDATURE
// ════════════════════════════════════════
exports.soumettreCandidature = async (req, res) => {
  const userId = req.user.id;
  const { service, budget, delai, besoin } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO candidatures (user_id, service, budget, delai, besoin) VALUES (?, ?, ?, ?, ?)`,
      [userId, service, budget, delai, besoin]
    );

    res.status(201).json({
      message: "Candidature soumise avec succès !",
      candidatureId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  VOIR MA CANDIDATURE
// ════════════════════════════════════════
exports.getCandidature = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM candidatures WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune candidature trouvée." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  RÉINITIALISATION MOT DE PASSE DIRECTE
// ════════════════════════════════════════
exports.resetPasswordDirect = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email et nouveau mot de passe requis." });
  }

  try {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucun compte trouvé avec cet e-mail." });
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashed, email.trim().toLowerCase()]
    );

    res.json({ message: "Mot de passe réinitialisé avec succès." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  VOIR MON PROFIL
// ════════════════════════════════════════
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, prenom, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════════════════════════════════════════
//  TOUS LES USERS (admin seulement)
// ════════════════════════════════════════
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, prenom, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};