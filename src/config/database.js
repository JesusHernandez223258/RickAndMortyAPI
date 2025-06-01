// src/config/database.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Usaremos un archivo llamado 'development.sqlite' en la raíz del proyecto.
// Puedes cambiarlo si prefieres que esté en otra ubicación, ej: './db/development.sqlite'
const DBSOURCE = path.join(__dirname, "../../development.sqlite");

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // No se puede abrir la base de datos
    console.error(err.message);
    throw err;
  } else {
    console.log("Conectado a la base de datos SQLite.");
    db.serialize(() => {
      // serialize asegura que las operaciones se ejecuten en orden
      // Crear tabla de usuarios si no existe
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE,
                passwordHash TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
          if (err) {
            console.error("Error creando tabla users:", err.message);
          } else {
            // console.log("Tabla 'users' asegurada.");
          }
        }
      );

      // Crear tabla de favoritos si no existe
      db.run(
        `CREATE TABLE IF NOT EXISTS user_favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                itemType TEXT NOT NULL, -- 'characters', 'episodes', 'locations'
                itemId INTEGER NOT NULL,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(userId, itemType, itemId)
            )`,
        (err) => {
          if (err) {
            console.error("Error creando tabla user_favorites:", err.message);
          } else {
            // console.log("Tabla 'user_favorites' asegurada.");
          }
        }
      );
    });
  }
});

// Helper para ejecutar db.run como una promesa
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      // Usar 'function' para acceder a 'this.lastID' o 'this.changes'
      if (err) {
        console.error("Error running sql " + sql);
        console.error(err);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper para ejecutar db.get como una promesa
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        console.error("Error running sql: " + sql);
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Helper para ejecutar db.all como una promesa
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Error running sql: " + sql);
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db, // exportamos la instancia de la base de datos directa por si se necesita
  dbRun,
  dbGet,
  dbAll,
};
