// src/controllers/episodeController.js
const apiService = require("../services/rickAndMortyApiService");

// Listado paginado, búsqueda por nombre o código de episodio
exports.listEpisodes = async (req, res, next) => {
  try {
    const { page, name, episode } = req.query;
    const queryParams = {};
    if (page) queryParams.page = page;
    if (name) queryParams.name = name;
    if (episode) queryParams.episode = episode; // Filtro por código de episodio, ej: "S01E01"

    const response = await apiService.getAllEpisodes(queryParams);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Detalle del episodio
exports.getEpisodeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await apiService.getEpisodeById(id);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Endpoint "compuesto": Detalle del episodio con sus personajes completos
exports.getEpisodeWithCharacters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const episodeResponse = await apiService.getEpisodeById(id);
    const episodeData = episodeResponse.data;

    if (episodeData.characters && episodeData.characters.length > 0) {
      const charactersData = await apiService.fetchDataFromUrls(
        episodeData.characters
      );
      episodeData.characters_details = charactersData; // Añade los detalles
    } else {
      episodeData.characters_details = [];
    }
    // Opcional: remover episodeData.characters (que solo tiene URLs)
    // delete episodeData.characters;

    res.json(episodeData);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Obtener múltiples episodios por IDs
exports.getBatchEpisodes = async (req, res, next) => {
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

    const response = await apiService.getMultipleEpisodes(idsArray);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};
