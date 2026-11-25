import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseCard } from '../course-card/course-card';
import { CourseService } from '../course-service';
import { Course } from '../course';
import { SavedService } from '../saved-service';

@Component({
  selector: 'app-saved-page',
  imports: [RouterLink, CourseCard],
  templateUrl: './saved-page.html',
  styleUrl: './saved-page.css',
})
export class SavedPage {
  private courseService = inject(CourseService);
  protected saved = inject(SavedService);

  protected loading = signal(true);
  protected error = signal('');
  private courses = signal<Course[]>([]);

  protected savedCourses = computed(() => this.courses().filter((c) => this.saved.has(c.id)));

  constructor() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load the courses.');
        this.loading.set(false);
      },
    });
  }
}
