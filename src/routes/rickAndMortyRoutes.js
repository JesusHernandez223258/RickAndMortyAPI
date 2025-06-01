// src/routes/rickAndMortyRoutes.js
const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");
const episodeController = require("../controllers/episodeController"); // Ahora existe
const locationController = require("../controllers/locationController"); // Ahora existe
const utilityController = require("../controllers/utilityController");
const authMiddleware = require("../middleware/authMiddleware"); // <--- NUEVO: Importar middleware

// --- RUTAS DE PERSONAJES ---
// GET /api/v1/characters?page=1&name=rick&status=alive ...
router.get("/characters", characterController.listCharacters);
// GET /api/v1/characters/batch?ids=1,2,3
router.get("/characters/batch", characterController.getBatchCharacters);
// GET /api/v1/characters/random
router.get("/characters/random", utilityController.getRandomCharacter);
// GET /api/v1/characters/:id
router.get("/characters/:id", characterController.getCharacterDetails);
// GET /api/v1/characters/:id/episodes (Endpoint compuesto)
router.get(
  "/characters/:id/episodes",
  characterController.getCharacterWithEpisodes
);

// --- RUTAS DE EPISODIOS ---
// GET /api/v1/episodes?page=1&name=Pilot&episode=S01E01
router.get("/episodes", episodeController.listEpisodes);
// GET /api/v1/episodes/batch?ids=1,2,3
router.get("/episodes/batch", episodeController.getBatchEpisodes);
// GET /api/v1/episodes/random
router.get("/episodes/random", utilityController.getRandomEpisode);
// GET /api/v1/episodes/:id
router.get("/episodes/:id", episodeController.getEpisodeDetails);
// GET /api/v1/episodes/:id/characters (Endpoint compuesto)
router.get(
  "/episodes/:id/characters",
  episodeController.getEpisodeWithCharacters
);

// --- RUTAS DE UBICACIONES ---
// GET /api/v1/locations?page=1&name=Earth&type=Planet
router.get("/locations", locationController.listLocations);
// GET /api/v1/locations/batch?ids=1,2,3
router.get("/locations/batch", locationController.getBatchLocations);
// GET /api/v1/locations/random
router.get("/locations/random", utilityController.getRandomLocation); // Nueva ruta
// GET /api/v1/locations/:id
router.get("/locations/:id", locationController.getLocationDetails);
// GET /api/v1/locations/:id/residents (Endpoint compuesto)
router.get(
  "/locations/:id/residents",
  locationController.getLocationWithResidents
);

// --- RUTAS DE FAVORITOS (Protegidas) ---
// POST /api/v1/favorites  (body: { type: "characters", id: 1 })
router.post("/favorites", authMiddleware, utilityController.addFavorite); // <--- Protegida
// GET /api/v1/favorites
router.get("/favorites", authMiddleware, utilityController.getFavorites); // <--- Protegida
// DELETE /api/v1/favorites/:type/:id  (ej: /api/v1/favorites/characters/1)
router.delete(
  "/favorites/:type/:id",
  authMiddleware,
  utilityController.removeFavorite
); // <--- Protegida

module.exports = router;
