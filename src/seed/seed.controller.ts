import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get("pokemons")
  createSeed() {
    return this.seedService.create();
  }

  @Get("pokemons/multiplesRegistros")
  createSeedMutiplesRegistros() {
    return this.seedService.createMutiplesRegistros();
  }

  @Get("pokemons/multiplesRegistros2")
  createSeedMutiplesRegistros2() {
    return this.seedService.createMutiplesRegistros2();
  }
}
