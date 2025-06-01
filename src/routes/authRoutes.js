// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// @route   POST api/v1/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post("/register", authController.register);

// @route   POST api/v1/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post("/login", authController.login);

module.exports = router;
