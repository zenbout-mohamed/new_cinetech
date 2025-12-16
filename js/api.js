const API_KEY = '76964164b9ed93badb2ec3b3e14db6f5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';


async function fetchFromTMDB(endpoint) {
const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}&language=fr-FR`);
if (!response.ok) throw new Error('Erreur API TMDB');
return response.json();
}


export async function getPopularMovies(page = 1) {
return fetchFromTMDB(`/movie/popular?page=${page}`);
}


export async function getPopularSeries(page = 1) {
return fetchFromTMDB(`/tv/popular?page=${page}`);
}


export async function getDetails(type, id) {
return fetchFromTMDB(`/${type}/${id}?`);
}


export async function getCredits(type, id) {
return fetchFromTMDB(`/${type}/${id}/credits?`);
}

export async function getSimilar(type, id) {
return fetchFromTMDB(`/${type}/${id}/similar?`);
}


export async function searchMulti(query) {
return fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
}


export { IMAGE_URL };