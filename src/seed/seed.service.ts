import {  ConflictException, Injectable } from '@nestjs/common';
import { PokemonsService } from 'src/pokemons/pokemons.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonsService,
  ){}

  create(): string {
    try {
      this.pokemonService.createSeed();
      return "Executed seed";
    } catch (error) {
      throw new ConflictException(`${error}`);
    }
  }

  createMutiplesRegistros(): string {
    try {
      this.pokemonService.createSeedMultiplesRegistros();
      return "Executed seed multiples registros, insertando promesas";
    } catch (error) {
      throw new ConflictException(`${error}`);
    }
  }

  createMutiplesRegistros2(): string {
    try {
      this.pokemonService.createSeedMultiplesRegistros2();
      return "Executed seed multiples registros, insertando todo el arreglo junto";
    } catch (error) {
      throw new ConflictException(`${error}`);
    }
  }

}
