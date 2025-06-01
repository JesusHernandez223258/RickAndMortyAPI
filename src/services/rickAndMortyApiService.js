// src/services/rickAndMortyApiService.js
const axios = require("axios");
const API_BASE_URL = process.env.RICK_AND_MORTY_API_BASE_URL;

// --- PERSONAJES ---
async function getAllCharacters(queryParams) {
  return axios.get(`${API_BASE_URL}/character`, { params: queryParams });
}

async function getCharacterById(id) {
  return axios.get(`${API_BASE_URL}/character/${id}`);
}

async function getMultipleCharacters(idsArray) {
  // Ej: idsArray = [1, 2, 3]
  return axios.get(`${API_BASE_URL}/character/${idsArray.join(",")}`);
}

// --- EPISODIOS ---
async function getAllEpisodes(queryParams) {
  return axios.get(`${API_BASE_URL}/episode`, { params: queryParams });
}

async function getEpisodeById(id) {
  return axios.get(`${API_BASE_URL}/episode/${id}`);
}

async function getMultipleEpisodes(idsArray) {
  return axios.get(`${API_BASE_URL}/episode/${idsArray.join(",")}`);
}

// --- UBICACIONES ---
async function getAllLocations(queryParams) {
  return axios.get(`${API_BASE_URL}/location`, { params: queryParams });
}

async function getLocationById(id) {
  return axios.get(`${API_BASE_URL}/location/${id}`);
}

async function getMultipleLocations(idsArray) {
  return axios.get(`${API_BASE_URL}/location/${idsArray.join(",")}`);
}

// --- Helper para obtener datos de múltiples URLs (para interconexión) ---
async function fetchDataFromUrls(urls) {
  if (!urls || urls.length === 0) return [];
  const requests = urls.map((url) => axios.get(url).then((res) => res.data));
  return Promise.all(requests);
}

module.exports = {
  getAllCharacters,
  getCharacterById,
  getMultipleCharacters,
  getAllEpisodes,
  getEpisodeById,
  getMultipleEpisodes,
  getAllLocations,
  getLocationById,
  getMultipleLocations,
  fetchDataFromUrls,
};
