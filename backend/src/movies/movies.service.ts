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

    // Use OMDB's built-in pagination
    const { movies, totalResults } = await this.omdbService.searchMoviesWithPagination(query.trim(), page);
    const totalPages = Math.ceil(totalResults / pageSize);

    return {
      movies,
      totalResults,
      page,
      pageSize,
      totalPages: totalPages || 1,
    };
  }
}

