import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { OmdbService } from './omdb.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let omdbService: OmdbService;

  const mockOmdbService = {
    searchMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: OmdbService,
          useValue: mockOmdbService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    omdbService = module.get<OmdbService>(OmdbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return empty array for empty query', async () => {
      const result = await service.searchMovies('');
      expect(result).toEqual([]);
      expect(omdbService.searchMovies).not.toHaveBeenCalled();
    });

    it('should return empty array for whitespace-only query', async () => {
      const result = await service.searchMovies('   ');
      expect(result).toEqual([]);
      expect(omdbService.searchMovies).not.toHaveBeenCalled();
    });

    it('should call omdbService.searchMovies with trimmed query', async () => {
      const mockMovies = [
        { imdbID: '1', Title: 'Movie 1', Year: '2023', Poster: 'url1' },
        { imdbID: '2', Title: 'Movie 2', Year: '2023', Poster: 'url2' },
      ];
      mockOmdbService.searchMovies.mockResolvedValue(mockMovies);

      const result = await service.searchMovies('  batman  ');
      
      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman');
      expect(result).toEqual(mockMovies);
    });

    it('should return movies from omdbService', async () => {
      const mockMovies = [
        { imdbID: '1', Title: 'Movie 1', Year: '2023', Poster: 'url1' },
      ];
      mockOmdbService.searchMovies.mockResolvedValue(mockMovies);

      const result = await service.searchMovies('batman');
      
      expect(result).toEqual(mockMovies);
    });
  });

  describe('searchMoviesWithPagination', () => {
    const mockMovies = Array.from({ length: 25 }, (_, i) => ({
      imdbID: `${i + 1}`,
      Title: `Movie ${i + 1}`,
      Year: '2023',
      Poster: `url${i + 1}`,
    }));

    beforeEach(() => {
      mockOmdbService.searchMovies.mockResolvedValue(mockMovies);
    });

    it('should return empty result for empty query', async () => {
      const result = await service.searchMoviesWithPagination('', 1, 10);
      
      expect(result).toEqual({
        movies: [],
        totalResults: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      });
    });

    it('should paginate movies correctly - first page', async () => {
      const result = await service.searchMoviesWithPagination('batman', 1, 10);
      
      expect(result.movies).toHaveLength(10);
      expect(result.movies[0].imdbID).toBe('1');
      expect(result.movies[9].imdbID).toBe('10');
      expect(result.totalResults).toBe(25);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    it('should paginate movies correctly - middle page', async () => {
      const result = await service.searchMoviesWithPagination('batman', 2, 10);
      
      expect(result.movies).toHaveLength(10);
      expect(result.movies[0].imdbID).toBe('11');
      expect(result.movies[9].imdbID).toBe('20');
      expect(result.page).toBe(2);
    });

    it('should paginate movies correctly - last page', async () => {
      const result = await service.searchMoviesWithPagination('batman', 3, 10);
      
      expect(result.movies).toHaveLength(5);
      expect(result.movies[0].imdbID).toBe('21');
      expect(result.movies[4].imdbID).toBe('25');
      expect(result.page).toBe(3);
    });

    it('should handle page number exceeding total pages', async () => {
      const result = await service.searchMoviesWithPagination('batman', 10, 10);
      
      expect(result.movies).toHaveLength(5);
      expect(result.page).toBe(3); // Clamped to last page
    });

    it('should handle page number less than 1', async () => {
      const result = await service.searchMoviesWithPagination('batman', 0, 10);
      
      expect(result.movies).toHaveLength(10);
      expect(result.page).toBe(1); // Clamped to first page
    });

    it('should handle negative page number', async () => {
      const result = await service.searchMoviesWithPagination('batman', -1, 10);
      
      expect(result.movies).toHaveLength(10);
      expect(result.page).toBe(1); // Clamped to first page
    });

    it('should handle different page sizes', async () => {
      const result = await service.searchMoviesWithPagination('batman', 1, 5);
      
      expect(result.movies).toHaveLength(5);
      expect(result.totalPages).toBe(5);
      expect(result.pageSize).toBe(5);
    });

    it('should return all movies when pageSize exceeds total', async () => {
      const result = await service.searchMoviesWithPagination('batman', 1, 100);
      
      expect(result.movies).toHaveLength(25);
      expect(result.totalPages).toBe(1);
    });
  });
});

