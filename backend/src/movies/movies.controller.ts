import { Controller, Get, Query, BadRequestException, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './omdb.service';

export interface PaginatedMovies {
  movies: Movie[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<PaginatedMovies> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    return this.moviesService.searchMoviesWithPagination(query, page, pageSize);
  }
}

