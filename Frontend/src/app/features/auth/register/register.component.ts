import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }

  readonly registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMsg.set(null);
    this.successMsg.set(null);
    this.isLoading.set(true);

    const { username, email, password, confirmPassword } = this.registerForm.value;
    const registerDto = { userName: username, email, password, confirmPassword };

    this.authService.register(registerDto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('تم إنشاء الحساب بنجاح! جاري توجيهك لصفحة تسجيل الدخول...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message || err.error?.title || 'فشل تسجيل الحساب. البريد الإلكتروني أو اسم المستخدم قد يكون مسجلاً بالفعل.');
      }
    });
  }
}
