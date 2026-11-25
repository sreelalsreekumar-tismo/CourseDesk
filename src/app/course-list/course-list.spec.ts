import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseList } from './course-list';

describe('CourseList', () => {
  let fixture: ComponentFixture<CourseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseList);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('treats a bad category or hours value as the default', () => {
    fixture.componentRef.setInput('category', 'abc');
    fixture.componentRef.setInput('maxHours', 'abc');
    fixture.componentRef.setInput('sort', 'xyz');
    const list = fixture.componentInstance as unknown as {
      cat(): string;
      maxHrs(): number;
      sortKey(): string;
    };
    expect(list.cat()).toBe('all');
    expect(list.maxHrs()).toBe(12);
    expect(list.sortKey()).toBe('title');
  });
});
