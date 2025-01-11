import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { idMongoPipe } from 'src/common/pipes/idMongo.pipe';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  findAll(
    @Query() PaginationDto: PaginationDto,
  ) {
    console.log(PaginationDto)
    return this.pokemonsService.findAll(PaginationDto);
  }

  @Get(':id')
  findById(
    @Param('id', idMongoPipe) id: string,
  ) {
    return this.pokemonsService.findById(id);
  }

  @Patch()
  createSeed() {
    return this.pokemonsService.createSeed();
  }

  
}
