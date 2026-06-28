import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  forkJoin,
  map,
  Observable,
  switchMap,
  catchError,
  shareReplay,
} from 'rxjs';
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

  private pageCache = new Map<number, Observable<Pokemon[]>>();
  private searchCache = new Map<string, Observable<Pokemon>>();
 
  constructor(private http: HttpClient) {}
 
  getPokemons(offset: number = 0): Observable<Pokemon[]> {
    const cached = this.pageCache.get(offset);
    if (cached) {
      return cached;
    }
 
    const request$ = this.http
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


          this.pageCache.delete(offset);
          const message =
            error instanceof Error
              ? error.message
              : 'Error al obtener los Pokémon. Intenta nuevamente.';
          return throwError(() => new Error(message));
        }),

        shareReplay({ bufferSize: 1, refCount: true })
      );
 
    this.pageCache.set(offset, request$);
    return request$;
  }
 
  searchPokemon(nameOrId: string): Observable<Pokemon> {
    const key = nameOrId.toLowerCase().trim();
    const cached = this.searchCache.get(key);
    if (cached) {
      return cached;
    }
 
    const request$ = this.http.get<Pokemon>(`${this.BASE_URL}/pokemon/${key}`).pipe(
      catchError((error: unknown) => {
        this.searchCache.delete(key);
        const message =
          error instanceof Error
            ? error.message
            : `No se encontró el Pokémon: ${nameOrId}`;
        return throwError(() => new Error(message));
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
 
    this.searchCache.set(key, request$);
    return request$;
  }
}
 