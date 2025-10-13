import { Movie } from '@/types/movie';

const FAVORITES_KEY = 'movie-favorites';

export const favoritesStorage = {
  getFavorites(): Movie[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      return [];
    }
  },

  saveFavorites(favorites: Movie[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  },

  addFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    if (!favorites.find((m) => m.imdbID === movie.imdbID)) {
      favorites.push(movie);
      this.saveFavorites(favorites);
    }
  },

  removeFavorite(imdbID: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter((m) => m.imdbID !== imdbID);
    this.saveFavorites(filtered);
  },

  isFavorite(imdbID: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some((m) => m.imdbID === imdbID);
  },

  clearFavorites(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_KEY);
  },
};

