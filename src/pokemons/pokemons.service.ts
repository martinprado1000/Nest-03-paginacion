import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import axios, { AxiosInstance } from 'axios';
import { seedPokemon } from './interfaces/seed-pokemons.interface';
import { Pokemon } from './schemas/pokemon.schema';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PokemonsService {
  private readonly axios: AxiosInstance = axios;
  private defaultLimit:number;
  constructor(
    @InjectModel(Pokemon.name) private PokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('pagination.defaultLimit')
    console.log(process.env.PAGINATIOS_DEFAULT_LIMIT)
  }

  // En el siguiente metodo podria no usar el async/await usando Promise, pero no funciona porque {data} seguiria siendo un objeto y da error porque el tipo no seria seedPokemon.
  // create2(): Promise<seedPokemon> {
  //   const {data} = this.axios.get<seedPokemon>("https://pokeapi.co/api/v2/pokemon?limit=600") // Obtenemos la respuesta de data si no genera una referencias circulares a JSON
  //   console.log(data.results)
  //   return data;
  // }
  //---------------------------Inserto registro por registro------------------------------------------------------------------------------------------------------------
  async createSeed(): Promise<string> {
    await this.PokemonModel.deleteMany({}); // Borro todos los registros

    const { data } = await this.axios.get<seedPokemon>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    ); // Obtenemos la respuesta de data si no genera una referencias circulares a JSON

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/'); // Separo el url donde hay una /
      const numPokemon: number = +segments[segments.length - 2]; // Estraigo el anteultimo valor que es el numero de pokemon. Agrego el + porque en la url viene como extring
      console.log(name, numPokemon);
      const res = await this.PokemonModel.create({ name, number: numPokemon });
      console.log(res);
    });

    return 'Seed executed';
  }

  //----------------------------Inserto promesas sin esperar--------------------------------------------------------------------------------------------------------------------------
  // Esto va a generar los mismos registros que el metodo anterio con la diferencia que no espera en cada insersion.
  // Lo que hace es crear un arreglo de promesas y luego los inserta todos juntos.
  async createSeedMultiplesRegistros(): Promise<seedPokemon> {
    await this.PokemonModel.deleteMany({}); // Borro todos los registros

    const { data } = await this.axios.get<seedPokemon>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    ); // Obtenemos la respuesta de data si no genera una referencias circulares a JSON

    const insertPromiseArray = [];

    data.results.forEach(({ name, url }) => {
      // No es necesario el async aca porque no es necesario que espere la inserción de la promesa
      const segments = url.split('/');
      const numPokemon: number = +segments[segments.length - 2];
      insertPromiseArray.push(
        this.PokemonModel.create({ name, number: numPokemon }), // Insero todas las promesas, pero esto no espera cada insercion
      );
    });

    await Promise.all(insertPromiseArray); // Aca solo espero que se inserte la promesa

    return data;
  }

  //----------------------------Inserto sin esperar, esta es la opcion mas eficiente--------------------------------------------------------------------------------------------------------------------------
  // Esto va a generar los mismos registros que el metodo anterio con la diferencia que insertamos todo el arreglo junto.
  async createSeedMultiplesRegistros2(): Promise<seedPokemon> {
    await this.PokemonModel.deleteMany({});

    const { data } = await this.axios.get<seedPokemon>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    );

    const pokemonToInsert: { name: string; number: number }[] = []; // Creo el arreglo que voy a insertar

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const numPokemon: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, number: numPokemon }); // pusheo cada dato en el arreglo
    });

    await this.PokemonModel.insertMany(pokemonToInsert); // Inserto el arreglo todo junto

    return data;
  }

  //----------------------------findAll with parameters---------------------------------------------------------------------------------------------
  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0} = paginationDto //De esta forma destructuro pero si NO vinieron esos datos les aplico estos por defecto.
    console.log(paginationDto)
    return await this.PokemonModel.find()
    .limit(limit)   // Trae solo 5
    .skip(offset)   // Trae desde el 6 en adelante
    .sort({         // Ordena
      number:1      // 1 ordena de forma ascendente 
    })
    .select('-__v')  // Con el (-) menos alimina la columna indicada. Sin el - agrega lo que le indiquemos
  }

  //----------------------------findById---------------------------------------------------------------------------------------------
  async findById(id: string) {
    return await this.PokemonModel.findById(id);
  }
}
