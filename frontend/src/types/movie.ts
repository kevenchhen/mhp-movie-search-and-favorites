export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
}

export interface PaginatedMovies {
  movies: Movie[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

