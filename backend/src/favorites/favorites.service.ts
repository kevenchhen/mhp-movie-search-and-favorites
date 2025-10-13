import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from '../movies/omdb.service';

@Injectable()
export class FavoritesService {
  // In-memory storage for favorites
  private favorites: Map<string, Movie> = new Map();

  addFavorite(movie: Movie): Movie {
    this.favorites.set(movie.imdbID, movie);
    return movie;
  }

  removeFavorite(imdbID: string): void {
    if (!this.favorites.has(imdbID)) {
      throw new NotFoundException(`Movie with imdbID ${imdbID} not found in favorites`);
    }
    this.favorites.delete(imdbID);
  }

  getAllFavorites(): Movie[] {
    return Array.from(this.favorites.values());
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites.has(imdbID);
  }
}

