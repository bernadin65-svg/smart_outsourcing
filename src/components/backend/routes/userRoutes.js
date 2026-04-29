const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

// ════════════════════════════════════════
//  ROUTES PUBLIQUES (sans token)
// ════════════════════════════════════════

// Inscription
router.post("/register", controller.register);

// Connexion
router.post("/login", controller.login);

// ─────────────────────────────────────────────────────────────────
//  RÈGLE 1 & 3 : Envoi d'email transactionnel vers l'utilisateur
//  • Code de vérification (6 chiffres) → email de l'utilisateur
//  • Confirmation candidature BPO      → email de l'utilisateur
//
//  Route publique car appelée avant/pendant l'inscription
//  (l'utilisateur n'a pas encore de token à ce stade)
// ─────────────────────────────────────────────────────────────────
router.post("/send-email", controller.sendEmail);

// Réinitialisation directe du mot de passe
router.post("/reset-password-direct", controller.resetPasswordDirect);

// ════════════════════════════════════════
//  ROUTES PROTÉGÉES (token JWT requis)
// ════════════════════════════════════════

// Voir mon profil
router.get("/profile", protect, controller.getProfile);

// Soumettre une candidature BPO
router.post("/candidature", protect, controller.soumettreCandidature);

// Voir ma candidature
router.get("/candidature", protect, controller.getCandidature);

// Tous les utilisateurs (admin seulement)
router.get("/", protect, adminOnly, controller.getAllUsers);

module.exports = router;