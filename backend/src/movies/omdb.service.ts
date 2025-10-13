import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
}

export interface OmdbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

@Injectable()
export class OmdbService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.omdbapi.com/';

  constructor() {
    // For demo purposes, using a demo key. In production, use environment variables
    this.apiKey = process.env.OMDB_API_KEY || 'demo';
  }

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await axios.get<OmdbSearchResponse>(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          s: query,
          type: 'movie',
        },
      });

      if (response.data.Response === 'False') {
        if (response.data.Error?.includes('Movie not found')) {
          return [];
        }
        throw new HttpException(
          response.data.Error || 'Failed to fetch movies',
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data.Search || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          'Failed to connect to OMDb API',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw error;
    }
  }
}

