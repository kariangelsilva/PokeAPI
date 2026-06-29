import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-of',
  standalone: false,
  templateUrl: './of.html',
  styleUrl: './of.scss',
})
export class OfDemo implements OnInit {
  emittedValues: string[] = [];
  completed = false;

  ngOnInit(): void {
    of('Pikachu', 'Charmander', 'Bulbasaur').subscribe({
      next: (value) => this.emittedValues.push(value),
      complete: () => (this.completed = true),
    });
  }
}
