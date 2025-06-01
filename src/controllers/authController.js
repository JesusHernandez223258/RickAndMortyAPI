// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { dbGet, dbRun } = require("../config/database"); // <--- Importar helpers de DB

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nombre de usuario y contraseña son requeridos." });
    }

    // Verificar si el usuario ya existe en la BD
    const existingUserSql = "SELECT * FROM users WHERE username = ?";
    const existingUser = await dbGet(existingUserSql, [username]);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya existe." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUserId = uuidv4();

    // Insertar nuevo usuario en la BD
    const insertSql =
      "INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)";
    await dbRun(insertSql, [newUserId, username, passwordHash]);

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      userId: newUserId,
    });
  } catch (error) {
    console.error("Error en register:", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nombre de usuario y contraseña son requeridos." });
    }

    // Buscar usuario en la BD
    const findUserSql = "SELECT * FROM users WHERE username = ?";
    const user = await dbGet(findUserSql, [username]);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err; // Debería ser manejado por el 'catch' general
      res.json({
        message: "Login exitoso.",
        token,
        userId: user.id,
        username: user.username,
      });
    });
  } catch (error) {
    console.error("Error en login:", error);
    next(error);
  }
};
