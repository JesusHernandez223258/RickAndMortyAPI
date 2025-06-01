// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  // Obtener token del header
  const authHeader = req.header("Authorization");

  // Verificar si no hay token o el formato es incorrecto
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No hay token o es inválido, autorización denegada." });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token del "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "No hay token, autorización denegada." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user; // Añade el payload del token (que contiene el id del usuario) a la request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token no es válido." });
  }
};
