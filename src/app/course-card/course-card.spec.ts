import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CourseCard } from './course-card';
import { Course } from '../course';

const course: Course = {
  id: 12,
  title: 'Docker Compose',
  category: 'docker',
  level: 'intermediate',
  hours: 6,
  price: 0,
  seats: 20,
  enrolled: 20,
  description: '',
};

describe('CourseCard', () => {
  let fixture: ComponentFixture<CourseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCard);
    fixture.componentRef.setInput('course', course);
    await fixture.whenStable();
  });

  it('shows (full) when no seat is left', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('20 of 20 seats taken');
    expect(text).toContain('(full)');
  });

  it('sends the course id when Save is pressed', () => {
    let sent: number | undefined;
    fixture.componentInstance.save.subscribe((id) => (sent = id));
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button.save')?.click();
    expect(sent).toBe(12);
  });
});
