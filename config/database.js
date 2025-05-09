const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'piscine_et_poney_db',
  waitForConnections: true,
  connectionLimit: 10, //obligatoire ?
  queueLimit: 0 //obligatoire ?
});

// Fonction pour exécuter des requêtes SQL
async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return [result, null];
  } catch (error) {
    return [null, error];
  } finally {
    if (conn) {
      conn.release(); // Libérer la connexion
    }
  }
}

module.exports = pool;
