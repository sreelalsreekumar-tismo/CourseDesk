import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  nameCtrl = new FormControl('', { nonNullable: true });

  signIn(): void {
    const name = this.nameCtrl.value.trim();
    if (!name) return;

    this.auth.signIn(name);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/courses';
    this.router.navigateByUrl(returnUrl);
  }
}