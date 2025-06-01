// src/controllers/utilityController.js
const apiService = require("../services/rickAndMortyApiService");
const { dbRun, dbGet, dbAll } = require("../config/database"); // <--- Importar helpers de DB

// --- FUNCIONES DE EXPLORACIÓN ALEATORIA ---
exports.getRandomCharacter = async (req, res, next) => {
  try {
    const infoResponse = await apiService.getAllCharacters({ page: 1 });
    const count = infoResponse.data.info.count;
    const randomId = Math.floor(Math.random() * count) + 1;
    const characterResponse = await apiService.getCharacterById(randomId);
    res.json(characterResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message:
          "Personaje aleatorio no encontrado (posible ID inexistente), intenta de nuevo.",
      });
    }
    next(error);
  }
};

exports.getRandomEpisode = async (req, res, next) => {
  try {
    const infoResponse = await apiService.getAllEpisodes({ page: 1 });
    const count = infoResponse.data.info.count;
    const randomId = Math.floor(Math.random() * count) + 1;
    const episodeResponse = await apiService.getEpisodeById(randomId);
    res.json(episodeResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "Episodio aleatorio no encontrado, intenta de nuevo.",
      });
    }
    next(error);
  }
};

exports.getRandomLocation = async (req, res, next) => {
  try {
    const infoResponse = await apiService.getAllLocations({ page: 1 });
    const count = infoResponse.data.info.count;
    const randomId = Math.floor(Math.random() * count) + 1;
    const locationResponse = await apiService.getLocationById(randomId);
    res.json(locationResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "Ubicación aleatoria no encontrada, intenta de nuevo.",
      });
    }
    next(error);
  }
};

// --- FAVORITOS USANDO BASE DE DATOS ---

exports.addFavorite = async (req, res, next) => {
  try {
    const { type, id } = req.body;
    const numericId = parseInt(id, 10);
    const userId = req.user.id;

    if (!type || id === undefined || isNaN(numericId)) {
      return res
        .status(400)
        .json({
          message: "Tipo e ID son requeridos y el ID debe ser numérico.",
        });
    }

    const validTypes = ["characters", "episodes", "locations"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          message:
            "Tipo de favorito inválido. Debe ser 'characters', 'episodes', o 'locations'.",
        });
    }

    // SQLite: ON CONFLICT(userId, itemType, itemId) DO NOTHING
    const sql =
      "INSERT INTO user_favorites (userId, itemType, itemId) VALUES (?, ?, ?) ON CONFLICT(userId, itemType, itemId) DO NOTHING";
    const result = await dbRun(sql, [userId, type, numericId]);

    if (result.changes > 0) {
      res.status(201).json({
        message: `${type} con ID ${numericId} añadido a los favoritos.`,
        itemType: type,
        itemId: numericId,
      });
    } else {
      res.status(200).json({
        message: `${type} con ID ${numericId} ya estaba en favoritos.`,
        itemType: type,
        itemId: numericId,
      });
    }
  } catch (error) {
    console.error("Error añadiendo favorito:", error);
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sql = "SELECT itemType, itemId FROM user_favorites WHERE userId = ?";
    const rows = await dbAll(sql, [userId]);

    const favorites = {
      characters: [],
      episodes: [],
      locations: [],
    };

    rows.forEach((row) => {
      if (favorites[row.itemType]) {
        favorites[row.itemType].push(row.itemId);
      }
    });

    res.json(favorites);
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const numericId = parseInt(id, 10);
    const userId = req.user.id;

    if (!type || id === undefined || isNaN(numericId)) {
      return res
        .status(400)
        .json({
          message: "Tipo e ID son requeridos y el ID debe ser numérico.",
        });
    }

    const validTypes = ["characters", "episodes", "locations"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Tipo de favorito inválido." });
    }

    const sql =
      "DELETE FROM user_favorites WHERE userId = ? AND itemType = ? AND itemId = ?";
    const result = await dbRun(sql, [userId, type, numericId]);

    if (result.changes > 0) {
      res.json({
        message: `${type} con ID ${numericId} eliminado de los favoritos.`,
      });
    } else {
      res.status(404).json({
        message: `${type} con ID ${numericId} no encontrado en los favoritos.`,
      });
    }
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    next(error);
  }
};

// Ya no se exportan users ni userFavorites.
