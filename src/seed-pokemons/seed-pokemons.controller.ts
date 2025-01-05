import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedPokemonsService } from './seed-pokemons.service';

@Controller('seed-pokemons')
export class SeedPokemonsController {
  constructor(private readonly seedPokemonsService: SeedPokemonsService) {}

  @Get()
  findAll() {
    return this.seedPokemonsService.create();
  }


}
