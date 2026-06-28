import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapDemo implements OnInit {
  readonly originalValues: number[] = [1, 2, 3, 4, 5];
  transformedValues: number[] = [];

  ngOnInit(): void {
    of(...this.originalValues)
      .pipe(map((value) => value * 10))
      .subscribe((result) => this.transformedValues.push(result));
  }
}
