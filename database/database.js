const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS videojuegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    plataforma TEXT,
    genero TEXT,
    estado TEXT
  )
`);

module.exports = db;