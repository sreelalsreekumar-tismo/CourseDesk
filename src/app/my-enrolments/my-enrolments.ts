import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../course-service';
import { Enrolment } from '../course';

@Component({
  selector: 'app-my-enrolments',
  imports: [ReactiveFormsModule],
  templateUrl: './my-enrolments.html',
  styleUrl: './my-enrolments.css',
})
export class MyEnrolments implements OnInit {
  private courseService = inject(CourseService);
  protected enrolments = this.courseService.enrolments;

  protected loading = signal(true);
  protected error = signal('');
  protected actionError = signal('');
  protected editingId = signal<number | null>(null);
  protected nameCtrl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set('');
    this.courseService.loadEnrolments().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.error.set('Could not load enrolments.');
        this.loading.set(false);
      },
    });
  }

  /** The row disappears at once; if the server refuses it comes back in the same place. */
  protected cancel(enrolment: Enrolment): void {
    const index = this.courseService.enrolments().findIndex((e) => e.id === enrolment.id);
    this.actionError.set('');
    this.courseService.enrolments.update((list) => list.filter((e) => e.id !== enrolment.id));

    this.courseService.cancel(enrolment.id).subscribe({
      error: () => {
        this.courseService.enrolments.update((list) => [
          ...list.slice(0, index),
          enrolment,
          ...list.slice(index),
        ]);
        this.actionError.set('This enrolment could not be cancelled.');
      },
    });
  }

  protected startEdit(enrolment: Enrolment): void {
    this.actionError.set('');
    this.nameCtrl.setValue(enrolment.name);
    this.editingId.set(enrolment.id);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected canSave(): boolean {
    return this.nameCtrl.value.trim().length >= 3;
  }

  protected saveName(id: number): void {
    if (!this.canSave()) return;
    this.actionError.set('');
    this.courseService.rename(id, this.nameCtrl.value.trim()).subscribe({
      next: () => this.editingId.set(null),
      error: () => this.actionError.set('The name could not be changed.'),
    });
  }
}
