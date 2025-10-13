'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, favoritesApi } from '@/lib/api';
import { Movie } from '@/types/movie';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounce search query
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timer);
  });

  // Fetch movies with pagination
  const { data: paginatedData, isLoading, error } = useQuery({
    queryKey: ['movies', debouncedQuery, currentPage],
    queryFn: () => moviesApi.searchMovies(debouncedQuery, currentPage, pageSize),
    enabled: debouncedQuery.length > 0,
  });

  const movies = paginatedData?.movies || [];
  const totalPages = paginatedData?.totalPages || 0;
  const totalResults = paginatedData?.totalResults || 0;

  // Fetch favorites to check which movies are favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getFavorites,
  });

  const isFavorite = (imdbID: string) => favoritesApi.isFavorite(imdbID);

  const handleToggleFavorite = async (movie: Movie, isFavorite: boolean) => {
    if (isFavorite) {
      await favoritesApi.removeFavorite(movie.imdbID);
    } else {
      await favoritesApi.addFavorite(movie);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1>🎬 Movie Search</h1>
        <div className="nav">
          <Link href="/" className="nav-link active">
            Search
          </Link>
          <Link href="/favorites" className="nav-link">
            Favorites ({favorites.length})
          </Link>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies (e.g., batman, inception, avatar)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="error">
          Failed to fetch movies. Please try again later.
        </div>
      )}

      {isLoading && <div className="loading">Searching for movies...</div>}

      {!isLoading && !error && searchQuery && movies?.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2>No movies found</h2>
          <p>Try searching for a different movie title</p>
        </div>
      )}

      {!isLoading && !error && !searchQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h2>Start searching for movies</h2>
          <p>Enter a movie title in the search box above</p>
        </div>
      )}

      {movies && movies.length > 0 && (
        <>
          <div className="search-results-info">
            <p>
              Showing {movies.length} of {totalResults} results
            </p>
          </div>
          <div className="movies-grid">
            {movies.map((movie) => {
              const isFav = isFavorite(movie.imdbID);
              return (
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
                      className={`favorite-button ${isFav ? 'remove' : ''}`}
                      onClick={() => handleToggleFavorite(movie, isFav)}
                    >
                      {isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                className="pagination-button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

