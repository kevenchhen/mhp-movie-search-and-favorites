import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [MoviesModule, FavoritesModule],
})
export class AppModule {}

