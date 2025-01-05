import { Module } from '@nestjs/common';
import { SeedPokemonsService } from './seed-pokemons.service';
import { SeedPokemonsController } from './seed-pokemons.controller';

@Module({
  controllers: [SeedPokemonsController],
  providers: [SeedPokemonsService],
})
export class SeedPokemonsModule {}
