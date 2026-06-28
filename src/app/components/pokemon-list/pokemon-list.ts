import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Pokemon } from '../../models/pokemon.model';
import { PokeapiService } from '../../services/pokeapi';

@Component({
  selector: 'app-pokemon-list',
  standalone: false,
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
})
export class PokemonList implements OnInit {
  pokemons: Pokemon[] = [];
  loading = false;
  error: string | null = null;

  currentOffset = 0;
  readonly pageSize = 20;

  searchTerm = '';
  private searchSubject = new Subject<string>();
  searchResult: Pokemon | null = null;
  searchLoading = false;
  searchError: string | null = null;

  readonly typeColors: Record<string, string> = {
    fire: '#5035ff',
    water: '#4FC3F7',
    grass: '#66BB6A',
    electric: '#FFCA28',
    psychic: '#EC407A',
    ice: '#80DEEA',
    dragon: '#7986CB',
    dark: '#5D4037',
    fairy: '#F48FB1',
    fighting: '#EF5350',
    flying: '#90CAF9',
    poison: '#AB47BC',
    ground: '#D4A848',
    rock: '#9E9E9E',
    bug: '#9CCC65',
    ghost: '#7E57C2',
    steel: '#78909C',
    normal: '#3a3232',
  };

  constructor(
    private pokeapiService: PokeapiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPokemons();

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term.trim()) {
            this.searchResult = null;
            this.searchError = null;
            return of(null);
          }
          this.searchLoading = true;
          this.searchError = null;
          return this.pokeapiService.searchPokemon(term).pipe(
            catchError((err: Error) => {
              this.searchError = err.message;
              this.searchLoading = false;
              return of(null);
            })
          );
        })
      )
      .subscribe({
        next: (pokemon) => {
          this.searchResult = pokemon;
          this.searchLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  loadPokemons(): void {
    this.loading = true;
    this.error = null;
    this.pokeapiService.getPokemons(this.currentOffset).subscribe({
      next: (data) => {
        this.pokemons = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResult = null;
    this.searchError = null;
    this.searchSubject.next('');
  }

  nextPage(): void {
    this.currentOffset += this.pageSize;
    this.loadPokemons();
  }

  prevPage(): void {
    if (this.currentOffset >= this.pageSize) {
      this.currentOffset -= this.pageSize;
      this.loadPokemons();
    }
  }

  getSprite(pokemon: Pokemon): string {
    return (
      pokemon.sprites.other['official-artwork'].front_default ??
      pokemon.sprites.front_default ??
      ''
    );
  }

  getTypeColor(typeName: string): string {
    return this.typeColors[typeName] ?? '#7b2424';
  }

  formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  formatStat(name: string): string {
    const map: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      speed: 'Velocidad',
    };
    return map[name] ?? name;
  }
}
