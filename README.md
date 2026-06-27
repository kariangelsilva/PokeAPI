# Pokédex - Taller Angular + RxJS

Consumo de la PokéAPI con Angular v20 y RxJS, siguiendo los requerimientos del taller.

## Requisitos

- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)

## Instalación y ejecución

```bash
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

## Operadores RxJS utilizados

| Operador | Dónde | Para qué |
|---|---|---|
| `switchMap` | `PokeapiService.getPokemons()` | Transforma el Observable de lista en un Observable de detalles individuales |
| `forkJoin` | `PokeapiService.getPokemons()` | Ejecuta todas las peticiones de detalle en paralelo y emite cuando todas completan |
| `map` | `PokeapiService.getPokemons()` | Extrae `results` de la respuesta y ordena por ID |
| `shareReplay(1)` | `PokeapiService.getPokemons()` | Evita peticiones duplicadas ante múltiples suscriptores |
| `catchError` | `PokeapiService` | Captura errores HTTP y los transforma en mensajes legibles |
| `debounceTime` | `PokemonList.ngOnInit()` | Espera 400ms después del último keystroke antes de buscar |
| `distinctUntilChanged` | `PokemonList.ngOnInit()` | Evita peticiones repetidas con el mismo término |
| `switchMap` (búsqueda) | `PokemonList.ngOnInit()` | Cancela búsquedas anteriores al escribir un nuevo término |

## Estructura del proyecto

```
src/app/
├── models/
│   └── pokemon.model.ts       # Interfaces tipadas (sin any)
├── services/
│   └── pokeapi.ts             # Servicio con switchMap + forkJoin + map
├── components/
│   └── pokemon-list/
│       ├── pokemon-list.ts    # Componente con ngOnInit, paginación y búsqueda
│       ├── pokemon-list.html  # Template con *ngFor, estados de carga y error
│       └── pokemon-list.scss  # Estilos Pokédex
├── app-module.ts              # HttpClientModule registrado aquí
├── app.ts
└── app.html
```

## Funcionalidades implementadas

**Obligatorias**
- ✅ `HttpClientModule` en el módulo raíz
- ✅ Interfaces TypeScript completas (sin `any`)
- ✅ `switchMap` + `forkJoin` + `map` en el servicio
- ✅ `catchError` con mensaje visible en la UI
- ✅ Tarjetas con imagen, nombre, tipos, altura, peso, exp base y cantidad de habilidades
- ✅ Estados de carga y error visibles

**Opcionales**
- ✅ Paginación con `offset`
- ✅ Búsqueda con `debounceTime` + `switchMap`
- ✅ `shareReplay(1)` para caché
