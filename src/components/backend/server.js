const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globaux ──
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174" ]
}));
app.use(express.json()); // permet de lire le JSON des requêtes

// ── Routes ──
app.use("/api/users", userRoutes);

// ── Test rapide ──
app.get("/", (req, res) => {
  res.json({ message: "SmartFlow API fonctionne ! ✅" });
});

// ── Démarrage ──
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});