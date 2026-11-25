import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedService {
  readonly ids = signal<number[]>([]);
  readonly count = computed(() => this.ids().length);

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number): void {
    this.ids.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }
}
