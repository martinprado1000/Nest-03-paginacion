import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]), // Le indico al modulo el nombre y el esquema que va a usar
  ],
  controllers: [PokemonsController],
  providers: [PokemonsService],
  exports: [ PokemonsService ]
})
export class PokemonsModule {}
