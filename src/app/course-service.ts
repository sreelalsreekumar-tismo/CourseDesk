import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Course, Enrolment } from './course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);

  /** The one list of enrolments shared by the header and the pages. */
  readonly enrolments = signal<Enrolment[]>([]);

  getCourses(text: string = ''): Observable<Course[]> {
    let params = new HttpParams();
    if (text) {
      params = params.set('q', text);
    }
    return this.http.get<Course[]>('/api/courses', { params });
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${id}`);
  }

  getEnrolments(): Observable<Enrolment[]> {
    return this.http.get<Enrolment[]>('/api/enrolments');
  }

  /** Loads the enrolments into the shared list. */
  loadEnrolments(): Observable<Enrolment[]> {
    return this.getEnrolments().pipe(tap((list) => this.enrolments.set(list)));
  }

  enrol(courseId: number, name: string, email: string): Observable<Enrolment> {
    return this.http
      .post<Enrolment>('/api/enrolments', { courseId, name, email })
      .pipe(tap((created) => this.enrolments.update((list) => [...list, created])));
  }

  rename(id: number, name: string): Observable<Enrolment> {
    return this.http
      .put<Enrolment>(`/api/enrolments/${id}`, { name })
      .pipe(
        tap((changed) =>
          this.enrolments.update((list) => list.map((e) => (e.id === id ? changed : e)))
        )
      );
  }

  cancel(id: number): Observable<Enrolment> {
    return this.http.delete<Enrolment>(`/api/enrolments/${id}`);
  }
}
