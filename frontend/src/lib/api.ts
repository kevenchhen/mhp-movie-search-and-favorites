import axios from 'axios';
import { Movie, PaginatedMovies } from '@/types/movie';
import { favoritesStorage } from './favorites-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const moviesApi = {
  searchMovies: async (query: string, page: number = 1, pageSize: number = 10): Promise<PaginatedMovies> => {
    const { data } = await api.get<PaginatedMovies>('/movies/search', {
      params: { query, page, pageSize },
    });
    return data;
  },
};

// Favorites now use localStorage for persistence
export const favoritesApi = {
  getFavorites: async (): Promise<Movie[]> => {
    return favoritesStorage.getFavorites();
  },

  addFavorite: async (movie: Movie): Promise<Movie> => {
    favoritesStorage.addFavorite(movie);
    return movie;
  },

  removeFavorite: async (imdbID: string): Promise<void> => {
    favoritesStorage.removeFavorite(imdbID);
  },

  isFavorite: (imdbID: string): boolean => {
    return favoritesStorage.isFavorite(imdbID);
  },
};

