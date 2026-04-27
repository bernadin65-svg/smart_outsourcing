const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true,  // ✅ SSL obligatoire pour TiDB Cloud
    minVersion: "TLSv1.2"
  }
});

const db = pool.promise();

db.getConnection()
  .then(() => console.log("✅ TiDB connecté !"))
  .catch((err) => console.error("❌ Erreur MySQL :", err.message));

module.exports = db;