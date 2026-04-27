// On importe mysql2 et dotenv
const mysql = require("mysql2");
require("dotenv").config();

// On crée un "pool" de connexions
// (comme avoir plusieurs guichets ouverts en même temps)
const pool = mysql.createPool({
  host:     process.env.DB_HOST,      // localhost
  user:     process.env.DB_USER,      // root
  password: process.env.DB_PASSWORD,  // votre mot de passe
  database: process.env.DB_NAME,      // smartflow_db
  port:     process.env.DB_PORT,      // 3306
  waitForConnections: true,
  connectionLimit: 10,                // max 10 connexions simultanées
});

// On utilise la version "promise" pour écrire du code plus propre
const db = pool.promise();

// On teste la connexion au démarrage
db.getConnection()
  .then(() => console.log("✅ MySQL connecté !"))
  .catch((err) => console.error("❌ Erreur MySQL :", err.message));

// On exporte db pour l'utiliser dans les autres fichiers
module.exports = db;