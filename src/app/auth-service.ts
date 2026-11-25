import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  student = signal('');
  signedIn = computed(() => this.student().trim().length > 0);

  signIn(name: string): void {
    this.student.set(name.trim());
  }

  signOut(): void {
    this.student.set('');
  }
}
