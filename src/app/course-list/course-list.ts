import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CourseService } from '../course-service';
import { Category, Course, CATEGORIES, filterCourses, totalHours } from '../course';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { RouterLink } from '@angular/router';
import { Savednav } from '../savednav';

@Component({
  selector: 'app-course-list',
  imports: [RouterLink,ReactiveFormsModule, UpperCasePipe],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);

  readonly CATEGORIES = CATEGORIES;

  loading = signal(true);
  courses = signal<Course[]>([]);
  error = signal('');
  cat = signal<Category | 'all'>('all');
  maxhr = signal(12);
  searchCtrl = new FormControl('', { nonNullable: true });
  savedIds = inject(Savednav).savedIds

  shown = computed(() => filterCourses(this.courses(), this.cat(), this.maxhr()));
  totalHrs = computed(() => totalHours(this.shown()));

  ngOnInit() {
    this.searchCtrl.valueChanges
      .pipe(
        startWith(this.searchCtrl.value),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set('');
        }),
        switchMap((text) =>
          this.courseService.getCourses(text.trim()).pipe(
            catchError(() => {
              this.error.set('Could not load the courses.');
              return of([] as Course[]);
            })
          )
        )
      )
      .subscribe((data) => {
        this.courses.set(data);
        this.loading.set(false);
      });
  }

  setCategory(cat: Category | 'all') {
    this.cat.set(cat);
  }

  onSave(id: number) {
    this.savedIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }
}