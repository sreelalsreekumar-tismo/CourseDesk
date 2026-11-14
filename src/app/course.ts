export type Category = 'html' | 'css' | 'typescript' | 'angular' | 'docker';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: number;
  title: string;
  category: Category;
  level: Level;
  hours: number;
  price: number;
  seats: number;
  enrolled: number;
  description: string;
}

export interface Enrolment {
  id: number;
  courseId: number;
  courseTitle: string;
  name: string;
  email: string;
}

export const CATEGORIES: Category[] = ['html', 'css', 'typescript', 'angular', 'docker'];

export function seatsLeft(course: Course): number {
  return course.seats - course.enrolled;
}

export function filterCourses(
  courses: Course[],
  category: Category | 'all',
  maxHours?: number
): Course[] {
  return courses.filter(c =>
    (category === 'all' || c.category === category) &&
    (!maxHours || c.hours <= maxHours)
  );
}

export function totalHours(courses: Course[]): number {
  return courses.reduce((sum, c) => sum + c.hours, 0);
}

export function hoursByCategory(courses: Course[]): Record<Category, number> {
  const result: Record<Category, number> = {
    html: 0, css: 0, typescript: 0, angular: 0, docker: 0,
  };
  for (const c of courses) {
    result[c.category] += c.hours;
  }
  return result;
}

export function sortedByHours(courses: Course[], descending = false): Course[] {
  return [...courses].sort((a, b) =>
    descending ? b.hours - a.hours : a.hours - b.hours
  );
}   