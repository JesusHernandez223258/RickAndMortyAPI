const express = require("express");
const router = express.Router();
const rickAndMortyRoutes = require("./rickAndMortyRoutes");
const authRoutes = require("./authRoutes"); // <--- NUEVO

router.use("/auth", authRoutes); // <--- NUEVO: Rutas de autenticación bajo /api/v1/auth
router.use("/", rickAndMortyRoutes); // Rutas específicas de R&M

module.exports = router;
