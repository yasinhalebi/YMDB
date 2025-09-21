import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const fetchTrendingMovies = async (type = 'movie') => {
  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const response = await axios.get(`${BASE_URL}/trending/${endpoint}/week?api_key=${API_KEY}`);
    return response.data.results.slice(0, 15).map(item => ({ ...item, media_type: type }));
  } catch (error) {
    console.error(`Error fetching trending ${type}:`, error.response?.data || error.message);
    return [];
  }
};

export const fetchGenres = async (mediaType = 'movie') => {
  try {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const response = await axios.get(`${BASE_URL}/genre/${endpoint}/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error.response?.data || error.message);
    return [];
  }
};

export const fetchMovies = async (page = 1, sortBy = 'popularity.desc', genreIds = '') => {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}${genreIds ? `&with_genres=${genreIds}` : ''}`;
    console.log('Fetching movies with URL:', url);
    const response = await axios.get(url);
    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error fetching movies:', error.response?.data || error.message);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

export const fetchTvShows = async (page = 1, sortBy = 'popularity.desc', genreIds = '') => {
  try {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}${genreIds ? `&with_genres=${genreIds}` : ''}`;
    console.log('Fetching TV shows with URL:', url);
    const response = await axios.get(url);
    return {
      results: response.data.results.map(item => ({ ...item, media_type: 'tv' })),
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error.response?.data || error.message);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

export const fetchTVDetails = async (tvId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV details:', error.response?.data || error.message);
    return null;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    return null;
  }
};

export const fetchSearchResults = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    return {
      results: response.data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'),
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error fetching search results:', error.response?.data || error.message);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

export const fetchTopRated = async (mediaType = 'movie') => {
  try {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const response = await axios.get(`${BASE_URL}/${endpoint}/top_rated?api_key=${API_KEY}`);
    return response.data.results.slice(0, 15).map(item => ({ ...item, media_type: mediaType }));
  } catch (error) {
    console.error(`Error fetching top rated ${mediaType}:`, error.response?.data || error.message);
    return [];
  }
};

export const fetchCredits = async (id, mediaType = 'movie') => {
  try {
    const response = await axios.get(`${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching credits for ${mediaType} ${id}:`, error.response?.data || error.message);
    return { cast: [], crew: [] };
  }
};

export const fetchSimilar = async (mediaType = 'movie', id) => {
  try {
    if (!id) return [];
    const url = `${BASE_URL}/${mediaType}/${id}/similar?api_key=${API_KEY}`;
    console.log(`Fetching similar ${mediaType}:`, url);
    const response = await axios.get(url);
    return response.data.results.slice(0, 15).map(item => ({ ...item, media_type: mediaType }));
  } catch (error) {
    console.error(`Error fetching similar ${mediaType}:`, error.response?.data || error.message);
    return [];
  }
};