import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Enrolment } from './course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);

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

  enrol(courseId: number, name: string, email: string): Observable<Enrolment> {
    return this.http.post<Enrolment>('/api/enrolments', { courseId, name, email });
  }

  cancel(id: number): Observable<Enrolment> {
    return this.http.delete<Enrolment>(`/api/enrolments/${id}`);
  }
}