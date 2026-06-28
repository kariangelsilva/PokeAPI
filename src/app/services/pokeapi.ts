import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import {
  PokemonListItem,
  PokemonListResponse,
} from '../models/pokemon-req.model';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2';
  private readonly LIMIT = 20;

  constructor(private http: HttpClient) {}

  getPokemons(offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .get<PokemonListResponse>(
        `${this.BASE_URL}/pokemon?limit=${this.LIMIT}&offset=${offset}`
      )
      .pipe(
        map((response: PokemonListResponse) => response.results),
        switchMap((items: PokemonListItem[]) => {
          const detailRequests = items.map((item: PokemonListItem) =>
            this.http.get<Pokemon>(item.url)
          );
          return forkJoin(detailRequests);
        }),
        map((pokemons: Pokemon[]) => pokemons.sort((a, b) => a.id - b.id)),
        catchError((error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : 'Error al obtener los Pokémon. Intenta nuevamente.';
          return throwError(() => new Error(message));
        })
      );
  }

  searchPokemon(nameOrId: string): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(
        `${this.BASE_URL}/pokemon/${nameOrId.toLowerCase().trim()}`
      )
      .pipe(
        catchError((error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : `No se encontró el Pokémon: ${nameOrId}`;
          return throwError(() => new Error(message));
        })
      );
  }
}
