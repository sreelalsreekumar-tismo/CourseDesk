import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course-service';
import { Course ,seatsLeft,Enrolment} from '../course';
import { EnrolForm } from '../enrol-form/enrol-form';



@Component({
  imports: [EnrolForm],
  selector: 'app-course-detail',
  styleUrl: './course-detail.css',
  templateUrl: './course-detail.html',
})
export class CourseDetail {
   seatsLeft = seatsLeft;
   route = inject(ActivatedRoute); 
    courseService = inject(CourseService);
    loading = signal(true);
error = signal('');
course = signal<Course | null>(null);
ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.loading.set(true);
  this.error.set('');
  this.courseService.getCourse(id).subscribe({
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
onEnrolled(enrolment: Enrolment): void {
    this.course.update((c) => (c ? { ...c, enrolled: c.enrolled + 1 } : c));
  }

}
