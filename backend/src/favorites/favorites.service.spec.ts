import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    // Clear favorites after each test
    const favorites = service.getAllFavorites();
    favorites.forEach((movie) => {
      try {
        service.removeFavorite(movie.imdbID);
      } catch (error) {
        // Ignore errors when clearing
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should add a movie to favorites', () => {
      const movie = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'https://example.com/poster.jpg',
      };

      const result = service.addFavorite(movie);

      expect(result).toEqual(movie);
      expect(service.getAllFavorites()).toContainEqual(movie);
      expect(service.isFavorite(movie.imdbID)).toBe(true);
    });

    it('should add multiple movies to favorites', () => {
      const movie1 = {
        imdbID: 'tt1111111',
        Title: 'Movie 1',
        Year: '2023',
        Poster: 'url1',
      };
      const movie2 = {
        imdbID: 'tt2222222',
        Title: 'Movie 2',
        Year: '2023',
        Poster: 'url2',
      };

      service.addFavorite(movie1);
      service.addFavorite(movie2);

      const favorites = service.getAllFavorites();
      expect(favorites).toHaveLength(2);
      expect(favorites).toContainEqual(movie1);
      expect(favorites).toContainEqual(movie2);
    });

    it('should overwrite existing favorite with same imdbID', () => {
      const movie1 = {
        imdbID: 'tt1234567',
        Title: 'Original Movie',
        Year: '2023',
        Poster: 'url1',
      };
      const movie2 = {
        imdbID: 'tt1234567',
        Title: 'Updated Movie',
        Year: '2024',
        Poster: 'url2',
      };

      service.addFavorite(movie1);
      service.addFavorite(movie2);

      const favorites = service.getAllFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0]).toEqual(movie2);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a movie from favorites', () => {
      const movie = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);
      expect(service.isFavorite(movie.imdbID)).toBe(true);

      service.removeFavorite(movie.imdbID);

      expect(service.isFavorite(movie.imdbID)).toBe(false);
      expect(service.getAllFavorites()).not.toContainEqual(movie);
    });

    it('should throw NotFoundException when removing non-existent favorite', () => {
      expect(() => {
        service.removeFavorite('tt9999999');
      }).toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', () => {
      expect(() => {
        service.removeFavorite('tt9999999');
      }).toThrow('Movie with imdbID tt9999999 not found in favorites');
    });
  });

  describe('getAllFavorites', () => {
    it('should return empty array when no favorites', () => {
      const favorites = service.getAllFavorites();
      expect(favorites).toEqual([]);
    });

    it('should return all favorites', () => {
      const movies = [
        {
          imdbID: 'tt1111111',
          Title: 'Movie 1',
          Year: '2023',
          Poster: 'url1',
        },
        {
          imdbID: 'tt2222222',
          Title: 'Movie 2',
          Year: '2023',
          Poster: 'url2',
        },
        {
          imdbID: 'tt3333333',
          Title: 'Movie 3',
          Year: '2023',
          Poster: 'url3',
        },
      ];

      movies.forEach((movie) => service.addFavorite(movie));

      const favorites = service.getAllFavorites();
      expect(favorites).toHaveLength(3);
      expect(favorites).toEqual(expect.arrayContaining(movies));
    });

    it('should return favorites in order they were added', () => {
      const movie1 = {
        imdbID: 'tt1111111',
        Title: 'Movie 1',
        Year: '2023',
        Poster: 'url1',
      };
      const movie2 = {
        imdbID: 'tt2222222',
        Title: 'Movie 2',
        Year: '2023',
        Poster: 'url2',
      };

      service.addFavorite(movie1);
      service.addFavorite(movie2);

      const favorites = service.getAllFavorites();
      expect(favorites[0]).toEqual(movie1);
      expect(favorites[1]).toEqual(movie2);
    });
  });

  describe('isFavorite', () => {
    it('should return false for non-existent movie', () => {
      expect(service.isFavorite('tt9999999')).toBe(false);
    });

    it('should return true for existing favorite', () => {
      const movie = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);
      expect(service.isFavorite(movie.imdbID)).toBe(true);
    });

    it('should return false after removing favorite', () => {
      const movie = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);
      expect(service.isFavorite(movie.imdbID)).toBe(true);

      service.removeFavorite(movie.imdbID);
      expect(service.isFavorite(movie.imdbID)).toBe(false);
    });
  });
});

