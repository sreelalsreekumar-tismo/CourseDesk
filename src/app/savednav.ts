import { Service, signal } from '@angular/core';

@Service()
export class Savednav {
    savedIds = signal<number[]>([]);
}
