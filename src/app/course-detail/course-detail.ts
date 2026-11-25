import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../course-service';
import { Course, seatsLeft } from '../course';
import { EnrolForm } from '../enrol-form/enrol-form';

@Component({
  imports: [EnrolForm, RouterLink],
  selector: 'app-course-detail',
  styleUrl: './course-detail.css',
  templateUrl: './course-detail.html',
})
export class CourseDetail implements OnInit {
  /** The :id of the address; it arrives as text. */
  readonly id = input.required<string>();

  protected readonly seatsLeft = seatsLeft;
  private courseService = inject(CourseService);

  protected loading = signal(true);
  protected error = signal('');
  protected course = signal<Course | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set('');
    this.courseService.getCourse(Number(this.id())).subscribe({
      next: (data) => {
        this.course.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('This course could not be found.');
        this.course.set(null);
        this.loading.set(false);
      },
    });
  }

  protected onEnrolled(): void {
    this.course.update((c) => (c ? { ...c, enrolled: c.enrolled + 1 } : c));
  }
}
