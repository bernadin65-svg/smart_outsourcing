const db      = require("../config/db");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// ════════════════════════════════════════
//  INSCRIPTION
// ════════════════════════════════════════
exports.register = async (req, res) => {
  // 1. On récupère ce que l'utilisateur a envoyé
  const { nom, prenom, email, password } = req.body;

  // 2. On vérifie que tous les champs sont remplis
  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    // 3. On vérifie si l'email existe déjà dans MySQL
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    // 4. On chiffre le mot de passe (jamais stocker en clair !)
    // bcrypt transforme "monMotDePasse" en "$2a$12$xK9..."
    const hashed = await bcrypt.hash(password, 12);

    // 5. On insère l'utilisateur dans MySQL
    const [result] = await db.query(
      `INSERT INTO users (nom, prenom, email, password)
       VALUES (?, ?, ?, ?)`,
      [nom, prenom, email, hashed]
    );

    // 6. On répond avec succès
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
    // 1. On cherche l'utilisateur par email dans MySQL
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // 2. Si aucun résultat → email incorrect
    if (rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    const user = rows[0];

    // 3. On compare le mot de passe tapé avec le hash stocké
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    // 4. On crée un token JWT (carte d'identité numérique)
    // Ce token prouve que l'utilisateur est bien connecté
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // valable 7 jours
    );

    // 5. On renvoie le token et les infos de l'utilisateur
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
  // req.user.id vient du middleware auth (le token)
  const userId = req.user.id;
  const { service, budget, delai, besoin } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO candidatures (user_id, service, budget, delai, besoin)
       VALUES (?, ?, ?, ?, ?)`,
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