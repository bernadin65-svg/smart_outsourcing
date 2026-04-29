const jwt = require("jsonwebtoken");

// Ce middleware vérifie le token avant d'accéder aux routes protégées
// C'est comme un vigile à l'entrée d'une boîte de nuit
exports.protect = (req, res, next) => {

  // On cherche le token dans le header de la requête
  // Format attendu : "Authorization: Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé. Connectez-vous d'abord." });
  }

  // On extrait le token (on enlève "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // On vérifie que le token est valide et non expiré
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On attache les infos de l'utilisateur à la requête
    req.user = decoded; // { id, email, role }

    next(); // on passe à la suite
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

// Vérifie que l'utilisateur est admin
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Réservé aux administrateurs." });
  }
  next();
};