import { Controller, Get, Post, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Movie } from '../movies/omdb.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(): Movie[] {
    return this.favoritesService.getAllFavorites();
  }

  @Post()
  addFavorite(@Body() movie: Movie): Movie {
    return this.favoritesService.addFavorite(movie);
  }

  @Delete(':imdbID')
  removeFavorite(@Param('imdbID') imdbID: string): { message: string } {
    try {
      this.favoritesService.removeFavorite(imdbID);
      return { message: 'Movie removed from favorites' };
    } catch (error) {
      throw new NotFoundException(`Movie with imdbID ${imdbID} not found`);
    }
  }
}

