import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { seedPokemon } from './interfaces/seed-pokemons.interface';

@Injectable()
export class SeedPokemonsService {
  
  private readonly axios: AxiosInstance = axios;

  async create(): Promise<seedPokemon> {
    const {data} = await this.axios.get<seedPokemon>("https://pokeapi.co/api/v2/pokemon?limit=50") // Obtenemos la respuesta de data si no genera una referencias circulares a JSON
    console.log(data.results)

    data.results.forEach(({name,url})=> {
      const segments = url.split('/');                // Separo el url donde hay una /
      const numPokemon = segments[segments.length-2]  // Estraigo el anteultimo valor que es el numero de pokemon.  
      console.log(name,numPokemon)

    })
    return data;
  }

  // Podria no usar el async/await usando Promise, pero en el siguiente caso no funciona porque {data} seguiria siendo un objeto y da error porque el tipo no seria seedPokemon. 
  // create2(): Promise<seedPokemon> {
  //   const {data} = this.axios.get<seedPokemon>("https://pokeapi.co/api/v2/pokemon?limit=600") // Obtenemos la respuesta de data si no genera una referencias circulares a JSON
  //   console.log(data.results)
  //   return data;
  // }


}
