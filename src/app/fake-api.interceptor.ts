// GIVEN FILE: do not edit. It plays the part of a server, so the exam works without internet.
// Every request whose address starts with /api/ is answered here, after a short delay.
import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface CourseRow {
  id: number;
  title: string;
  category: string;
  level: string;
  hours: number;
  seats: number;
  enrolled: number;
}

interface EnrolmentRow {
  id: number;
  courseId: number;
  courseTitle: string;
  name: string;
  email: string;
}

const courses: CourseRow[] = [
  { id: 1, title: 'HTML Basics', category: 'html', level: 'beginner', hours: 8, seats: 30, enrolled: 18 },
  { id: 2, title: 'Forms and Tables', category: 'html', level: 'beginner', hours: 6, seats: 30, enrolled: 30 },
  { id: 3, title: 'CSS Layout', category: 'css', level: 'intermediate', hours: 10, seats: 25, enrolled: 12 },
  { id: 4, title: 'Responsive Design', category: 'css', level: 'intermediate', hours: 8, seats: 25, enrolled: 9 },
  { id: 5, title: 'TypeScript Basics', category: 'typescript', level: 'beginner', hours: 12, seats: 30, enrolled: 22 },
  { id: 6, title: 'Types and Interfaces', category: 'typescript', level: 'intermediate', hours: 8, seats: 20, enrolled: 5 },
  { id: 7, title: 'Angular Components', category: 'angular', level: 'beginner', hours: 12, seats: 30, enrolled: 28 },
  { id: 8, title: 'Angular Routing', category: 'angular', level: 'intermediate', hours: 6, seats: 25, enrolled: 10 },
  { id: 9, title: 'Angular Forms', category: 'angular', level: 'intermediate', hours: 8, seats: 25, enrolled: 7 },
  { id: 10, title: 'RxJS and HTTP', category: 'angular', level: 'advanced', hours: 10, seats: 20, enrolled: 3 },
  { id: 11, title: 'Docker Basics', category: 'docker', level: 'beginner', hours: 6, seats: 30, enrolled: 15 },
  { id: 12, title: 'Docker Compose', category: 'docker', level: 'intermediate', hours: 6, seats: 20, enrolled: 20 },
];

const enrolments: EnrolmentRow[] = [
  { id: 1, courseId: 3, courseTitle: 'CSS Layout', name: 'Meera Nair', email: 'meera@example.com' },
];
let nextEnrolmentId = 2;

function reply(status: number, body: unknown): Observable<HttpEvent<unknown>> {
  return timer(400).pipe(
    mergeMap(() =>
      status < 300
        ? of(new HttpResponse({ status, body }))
        : throwError(() => new HttpErrorResponse({ status, error: body })),
    ),
  );
}

export const fakeApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  // GET /api/courses   (optional ?q=text: title contains the text, not case-sensitive)
  if (req.method === 'GET' && req.url === '/api/courses') {
    const q = (req.params.get('q') ?? '').trim().toLowerCase();
    return reply(200, courses.filter(c => c.title.toLowerCase().includes(q)).map(c => ({ ...c })));
  }

  // GET /api/courses/:id
  const one = req.url.match(/^\/api\/courses\/(\d+)$/);
  if (req.method === 'GET' && one) {
    const course = courses.find(c => c.id === Number(one[1]));
    return course ? reply(200, { ...course }) : reply(404, { message: 'Course not found' });
  }

  // GET /api/enrolments
  if (req.method === 'GET' && req.url === '/api/enrolments') {
    return reply(200, enrolments.map(e => ({ ...e })));
  }

  // POST /api/enrolments   body: { courseId, name, email }
  if (req.method === 'POST' && req.url === '/api/enrolments') {
    const body = req.body as { courseId?: number; name?: string; email?: string } | null;
    const course = courses.find(c => c.id === body?.courseId);
    if (!body || !body.name || !body.email) {
      return reply(400, { message: 'Name and email are required' });
    }
    if (!course) {
      return reply(404, { message: 'Course not found' });
    }
    if (course.enrolled >= course.seats) {
      return reply(409, { message: 'This course is full' });
    }
    if (enrolments.some(e => e.courseId === course.id && e.email.toLowerCase() === body.email!.toLowerCase())) {
      return reply(409, { message: 'This email is already enrolled in this course' });
    }
    const created: EnrolmentRow = {
      id: nextEnrolmentId++,
      courseId: course.id,
      courseTitle: course.title,
      name: body.name,
      email: body.email,
    };
    enrolments.push(created);
    course.enrolled++;
    return reply(201, { ...created });
  }

  // PUT /api/enrolments/:id   body: { name }
  const put = req.url.match(/^\/api\/enrolments\/(\d+)$/);
  if (req.method === 'PUT' && put) {
    const body = req.body as { name?: string } | null;
    const found = enrolments.find(e => e.id === Number(put[1]));
    if (!found) {
      return reply(404, { message: 'Enrolment not found' });
    }
    if (!body || !body.name || !body.name.trim()) {
      return reply(400, { message: 'Name is required' });
    }
    found.name = body.name.trim();
    return reply(200, { ...found });
  }

  // DELETE /api/enrolments/:id   (the enrolment with id 1 is locked: status 409)
  const del = req.url.match(/^\/api\/enrolments\/(\d+)$/);
  if (req.method === 'DELETE' && del) {
    const index = enrolments.findIndex(e => e.id === Number(del[1]));
    if (index < 0) {
      return reply(404, { message: 'Enrolment not found' });
    }
    if (enrolments[index].id === 1) {
      return reply(409, { message: 'This enrolment is locked and cannot be cancelled' });
    }
    const course = courses.find(c => c.id === enrolments[index].courseId);
    if (course) {
      course.enrolled--;
    }
    enrolments.splice(index, 1);
    return reply(200, null);
  }

  return reply(404, { message: 'Unknown address' });
};
