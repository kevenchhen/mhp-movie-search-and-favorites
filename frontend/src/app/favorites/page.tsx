'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api';
import Link from 'next/link';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  // Fetch favorites
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getFavorites,
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleRemoveFavorite = (imdbID: string) => {
    removeFavoriteMutation.mutate(imdbID);
  };

  return (
    <main className="container">
      <div className="header">
        <h1>❤️ My Favorites</h1>
        <div className="nav">
          <Link href="/" className="nav-link">
            Search
          </Link>
          <Link href="/favorites" className="nav-link active">
            Favorites ({favorites.length})
          </Link>
        </div>
      </div>

      <div className="favorites-header">
        <h2>Your Favorite Movies</h2>
        <span className="favorites-count">
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
        </span>
      </div>

      {error && (
        <div className="error">
          Failed to load favorites. Please try again later.
        </div>
      )}

      {isLoading && <div className="loading">Loading your favorites...</div>}

      {!isLoading && !error && favorites.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites from the search page</p>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img
                src={
                  movie.Poster !== 'N/A'
                    ? movie.Poster
                    : 'https://via.placeholder.com/300x450/2a2a2a/888?text=No+Poster'
                }
                alt={movie.Title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.Title}</h3>
                <p className="movie-year">{movie.Year}</p>
                <button
                  className="favorite-button remove"
                  onClick={() => handleRemoveFavorite(movie.imdbID)}
                  disabled={removeFavoriteMutation.isPending}
                >
                  {removeFavoriteMutation.isPending
                    ? 'Removing...'
                    : '❤️ Remove from Favorites'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

