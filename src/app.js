// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mainRoutes = require("./routes");
require("./config/database"); // <--- OPCIONAL: Inicializa la DB al arrancar

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para parsear bodies JSON

// Rutas principales de la API
app.use("/api/v1", mainRoutes); // Prefijo para todas las rutas de la API v1

// Handler para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

// Handler de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
