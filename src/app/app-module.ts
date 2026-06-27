import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { PokemonList } from './components/pokemon-list/pokemon-list';
import { MapDemo } from './components/map/map';
import { OfDemo } from './components/of/of';

@NgModule({
  declarations: [App, PokemonList, MapDemo, OfDemo],
  imports: [BrowserModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners(), provideZonelessChangeDetection()],
  bootstrap: [App],
})
export class AppModule {}
