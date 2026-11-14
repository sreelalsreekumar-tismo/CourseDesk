import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Enrolment } from '../course';
import { CourseService } from '../course-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-enrol-form',
  styleUrl: './enrol-form.css',
  templateUrl: './enrol-form.html',
})
export class EnrolForm {
   @Input({ required: true }) courseId!: number
   @Output() enrolled= new EventEmitter<Enrolment>()
    fb = inject(FormBuilder) 
    private courseService = inject(CourseService);
    sending = signal(false);
    serverError = signal('');
    success = signal('');
  noDigits(control: AbstractControl): ValidationErrors | null {
  return /\d/.test(control.value ?? '') ? { hasDigit: true } : null;
}
phoneOptional(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (value === '') return null;
  return /^\d{10}$/.test(value) ? null : { phone: true };
}form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3), this.noDigits]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [this.phoneOptional]],
});

submit(): void {
  if (this.form.invalid || this.sending()) return;

  this.sending.set(true);
  this.serverError.set('');
  this.success.set('');

  const { name, email } = this.form.getRawValue();

  this.courseService.enrol(this.courseId, name!.trim(), email!.trim()).subscribe({
    next: (enrolment) => {
      this.success.set(
        `Thank you, ${enrolment.name}! Your reference is ${enrolment.id}.`
      );
      this.form.reset();
      this.enrolled.emit(enrolment);
      this.sending.set(false);
    },
    error: () => {
      this.serverError.set(
        'Could not enrol. The email may already be used, or the course is full.'
      );
      this.sending.set(false);
    },
  });
}}