import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth-service';
import { CourseService } from './course-service';
import { SavedService } from './saved-service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('coursedesk');
  protected auth = inject(AuthService);
  protected courseService = inject(CourseService);
  protected saved = inject(SavedService);
  private router = inject(Router);

  constructor() {
    // The enrolment list is loaded when a student signs in and emptied on sign out.
    effect(() => {
      if (this.auth.signedIn()) {
        this.courseService.loadEnrolments().subscribe({ error: () => undefined });
      } else {
        this.courseService.enrolments.set([]);
      }
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
