import { Injectable } from '@nestjs/common';
import { OmdbService, Movie } from './omdb.service';
import { PaginatedMovies } from './movies.controller';

@Injectable()
export class MoviesService {
  constructor(private readonly omdbService: OmdbService) {}

  async searchMovies(query: string): Promise<Movie[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return this.omdbService.searchMovies(query.trim());
  }

  async searchMoviesWithPagination(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedMovies> {
    if (!query || query.trim().length === 0) {
      return {
        movies: [],
        totalResults: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }

    const allMovies = await this.omdbService.searchMovies(query.trim());
    const totalResults = allMovies.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    
    // Clamp page to valid range
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    
    // Calculate pagination
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const movies = allMovies.slice(startIndex, endIndex);

    return {
      movies,
      totalResults,
      page: validPage,
      pageSize,
      totalPages: totalPages || 1,
    };
  }
}

