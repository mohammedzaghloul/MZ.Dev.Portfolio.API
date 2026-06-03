import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    .input-wrap.has-password-toggle input {
      padding-right: 3.1rem !important;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 2.1rem;
      height: 2.1rem;
      border: 0;
      border-radius: 0.65rem;
      background: transparent;
      color: var(--muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      z-index: 6;
    }

    .password-toggle:hover,
    .password-toggle:focus-visible {
      color: var(--accent);
      background: rgba(var(--accent-rgb), 0.1);
      box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.14);
      outline: none;
    }

    .password-toggle i {
      position: static !important;
      inset: auto !important;
      transform: none !important;
      pointer-events: auto !important;
      font-size: 0.95rem !important;
      color: currentColor !important;
    }
  `]
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly errorMsg = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMsg.set(null);
    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message || err.error?.title || 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      }
    });
  }
}
