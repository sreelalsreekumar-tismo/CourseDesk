import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CourseService } from '../course-service';
import { SavedService } from '../saved-service';
import { CourseCard } from '../course-card/course-card';
import {
  CATEGORIES,
  Category,
  Course,
  filterCourses,
  sortedByHours,
  totalHours,
} from '../course';

type SortKey = 'title' | 'hours-asc' | 'hours-desc';

const SORTS: SortKey[] = ['title', 'hours-asc', 'hours-desc'];
const DEFAULT_HOURS = 12;
const PAGE_SIZE = 6;

@Component({
  selector: 'app-course-list',
  imports: [RouterLink, ReactiveFormsModule, UpperCasePipe, CourseCard],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  protected saved = inject(SavedService);

  // Values from the address (?category=...&maxHours=...&sort=...&page=...)
  readonly category = input<string>();
  readonly maxHours = input<string>();
  readonly sort = input<string>();
  readonly page = input<string>();

  protected readonly CATEGORIES = CATEGORIES;

  protected loading = signal(true);
  protected error = signal('');
  protected courses = signal<Course[]>([]);
  protected searchCtrl = new FormControl('', { nonNullable: true });

  protected cat = computed<Category | 'all'>(() => {
    const value = this.category();
    return CATEGORIES.find((c) => c === value) ?? 'all';
  });

  protected maxHrs = computed(() => {
    const n = Number(this.maxHours());
    return Number.isInteger(n) && n >= 6 && n <= DEFAULT_HOURS ? n : DEFAULT_HOURS;
  });

  protected sortKey = computed<SortKey>(() => SORTS.find((s) => s === this.sort()) ?? 'title');

  protected shown = computed(() => {
    const matching = filterCourses(this.courses(), this.cat(), this.maxHrs());
    switch (this.sortKey()) {
      case 'hours-asc':
        return sortedByHours(matching);
      case 'hours-desc':
        return sortedByHours(matching, true);
      default:
        return [...matching].sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  protected totalHrs = computed(() => totalHours(this.shown()));
  protected pageCount = computed(() => Math.max(1, Math.ceil(this.shown().length / PAGE_SIZE)));

  protected currentPage = computed(() => {
    const n = Number(this.page());
    return Number.isInteger(n) && n >= 1 ? Math.min(n, this.pageCount()) : 1;
  });

  protected pageItems = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.shown().slice(start, start + PAGE_SIZE);
  });

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        startWith(this.searchCtrl.value),
        debounceTime(400),
        map((text) => text.trim()),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set('');
        }),
        switchMap((text) =>
          this.courseService.getCourses(text).pipe(
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

  protected onMaxHours(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.updateQuery({ maxHours: value === DEFAULT_HOURS ? null : value, page: null });
  }

  protected onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.updateQuery({ sort: value === 'title' ? null : value, page: null });
  }

  protected goToPage(n: number): void {
    this.updateQuery({ page: n === 1 ? null : n });
  }

  private updateQuery(params: Record<string, string | number | null>): void {
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }
}
