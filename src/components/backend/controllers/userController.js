const db         = require("../config/db");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ── Transporter Nodemailer ──
const transporter = nodemailer.createTransport({
  service: "gmail",
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

    // ✅ Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: `"SmartFlow Outsourcing" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "✅ Bienvenue sur SmartFlow — Inscription confirmée",
      html: `
        <h2>Bienvenue ${nom} ${prenom} !</h2>
        <p>Votre compte a été créé avec succès sur SmartFlow Outsourcing.</p>
        <p>Vous pouvez maintenant vous connecter avec : <strong>${email}</strong></p>
        <br/>
        <p>Cordialement,</p>
        <p><strong>L'équipe SmartFlow Outsourcing</strong></p>
      `,
    });

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