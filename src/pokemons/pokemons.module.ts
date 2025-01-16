import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]), // Le indico al modulo el nombre y el esquema que va a usar
  ],
  controllers: [PokemonsController],
  providers: [PokemonsService],
  exports: [ PokemonsService ]
})
export class PokemonsModule {}
