import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonsModule } from 'src/pokemons/pokemons.module';

@Module({
  imports: [ PokemonsModule ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {} 
