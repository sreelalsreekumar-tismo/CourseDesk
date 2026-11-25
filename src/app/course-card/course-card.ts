import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Course, seatsLeft } from '../course';

@Component({
  imports: [RouterLink, UpperCasePipe],
  selector: 'app-course-card',
  styleUrl: './course-card.css',
  templateUrl: './course-card.html',
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly saved = input<boolean>(false);
  readonly save = output<number>();

  protected readonly seatsLeft = seatsLeft;

  protected percent(course: Course): number {
    return course.seats ? (course.enrolled / course.seats) * 100 : 0;
  }
}
