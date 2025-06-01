// src/controllers/locationController.js
const apiService = require("../services/rickAndMortyApiService");

// Listado paginado, búsqueda por nombre, filtrado por tipo o dimensión
exports.listLocations = async (req, res, next) => {
  try {
    const { page, name, type, dimension } = req.query;
    const queryParams = {};
    if (page) queryParams.page = page;
    if (name) queryParams.name = name;
    if (type) queryParams.type = type;
    if (dimension) queryParams.dimension = dimension;

    const response = await apiService.getAllLocations(queryParams);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Detalle de la ubicación
exports.getLocationDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await apiService.getLocationById(id);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Endpoint "compuesto": Detalle de la ubicación con sus residentes completos
exports.getLocationWithResidents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const locationResponse = await apiService.getLocationById(id);
    const locationData = locationResponse.data;

    if (locationData.residents && locationData.residents.length > 0) {
      const residentsData = await apiService.fetchDataFromUrls(
        locationData.residents
      );
      locationData.residents_details = residentsData; // Añade los detalles
    } else {
      locationData.residents_details = [];
    }
    // Opcional: remover locationData.residents (que solo tiene URLs)
    // delete locationData.residents;

    res.json(locationData);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};

// Obtener múltiples ubicaciones por IDs
exports.getBatchLocations = async (req, res, next) => {
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

    const response = await apiService.getMultipleLocations(idsArray);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    next(error);
  }
};
