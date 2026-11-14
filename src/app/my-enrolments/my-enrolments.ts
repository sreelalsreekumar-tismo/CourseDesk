import { Component, OnInit, inject, signal } from '@angular/core';
import { CourseService } from '../course-service';
import { Enrolment } from '../course';

@Component({
  selector: 'app-my-enrolments',
  imports: [],
  templateUrl: './my-enrolments.html',
  styleUrl: './my-enrolments.css',
})
export class MyEnrolments implements OnInit {
  private courseService = inject(CourseService);

  loading = signal(true);
  error = signal('');
  enrolments = signal<Enrolment[]>([]);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set('');
    this.courseService.getEnrolments().subscribe({
      next: (data) => {
        this.enrolments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load enrolments.');
        this.loading.set(false);
      },
    });
  }

  cancel(id: number): void {
    this.courseService.cancel(id).subscribe({
      next: () => {
        this.enrolments.update((list) => list.filter((e) => e.id !== id));
      },
      error: () => {
    
      },
    });
  }
}