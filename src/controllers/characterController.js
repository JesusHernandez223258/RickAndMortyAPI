// src/controllers/characterController.js
const apiService = require("../services/rickAndMortyApiService");

// 1. Exploración de Personajes
// Listado paginado, búsqueda por nombre, filtrado por atributos
exports.listCharacters = async (req, res, next) => {
  try {
    // Recoge todos los query params relevantes de la request
    const { page, name, status, species, type, gender } = req.query;
    const queryParams = {};
    if (page) queryParams.page = page;
    if (name) queryParams.name = name;
    if (status) queryParams.status = status;
    if (species) queryParams.species = species;
    if (type) queryParams.type = type;
    if (gender) queryParams.gender = gender;

    const response = await apiService.getAllCharacters(queryParams);
    res.json(response.data);
  } catch (error) {
    // Si el error es de Axios y tiene una respuesta del servidor externo
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error); // Pasa a un manejador de errores general
  }
};

// Detalle del personaje
exports.getCharacterDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await apiService.getCharacterById(id);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Endpoint "compuesto": Detalle del personaje con sus episodios completos
exports.getCharacterWithEpisodes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const characterResponse = await apiService.getCharacterById(id);
    const characterData = characterResponse.data;

    if (characterData.episode && characterData.episode.length > 0) {
      const episodesData = await apiService.fetchDataFromUrls(
        characterData.episode
      );
      characterData.episodes_details = episodesData; // Añade los detalles
    } else {
      characterData.episodes_details = [];
    }
    // Opcional: remover characterData.episode (que solo tiene URLs)
    // delete characterData.episode;

    res.json(characterData);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Obtener múltiples personajes por IDs
exports.getBatchCharacters = async (req, res, next) => {
  try {
    const { ids } = req.query; // Espera ids como "1,2,3"
    if (!ids) {
      return res
        .status(400)
        .json({
          message:
            "Parámetro 'ids' es requerido y debe ser una lista de IDs separados por coma.",
        });
    }
    const idsArray = ids
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));
    if (idsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron IDs válidos." });
    }

    const response = await apiService.getMultipleCharacters(idsArray);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};
