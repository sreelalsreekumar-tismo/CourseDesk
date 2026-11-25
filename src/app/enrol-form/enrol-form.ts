import { Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Enrolment } from '../course';
import { CourseService } from '../course-service';

function noDigits(control: AbstractControl): ValidationErrors | null {
  return /\d/.test(control.value ?? '') ? { hasDigit: true } : null;
}

function phoneOptional(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (value === '') return null;
  return /^\d{10}$/.test(value) ? null : { phone: true };
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-enrol-form',
  styleUrl: './enrol-form.css',
  templateUrl: './enrol-form.html',
})
export class EnrolForm {
  readonly courseId = input.required<number>();
  readonly enrolled = output<Enrolment>();

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);

  protected sending = signal(false);
  protected serverError = signal('');
  protected success = signal('');

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), noDigits]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [phoneOptional]],
  });

  protected submit(): void {
    if (this.form.invalid || this.sending()) return;

    this.sending.set(true);
    this.serverError.set('');
    this.success.set('');

    const { name, email } = this.form.getRawValue();

    this.courseService.enrol(this.courseId(), name.trim(), email.trim()).subscribe({
      next: (enrolment) => {
        this.success.set(`Thank you, ${enrolment.name}! Your reference is ${enrolment.id}.`);
        this.form.reset();
        this.enrolled.emit(enrolment);
        this.sending.set(false);
      },
      error: () => {
        this.serverError.set('Could not enrol. The email may already be used, or the course is full.');
        this.sending.set(false);
      },
    });
  }
}
