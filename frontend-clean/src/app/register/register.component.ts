import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    roles = ['ADMIN', 'APPROBATEUR', 'EMPLOYE'];
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            role: ['votre role', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.invalid || this.isLoading) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.register(this.registerForm.value).subscribe({
            next: (response: any) => {
                this.authService.login({
                    email: this.registerForm.value.email,
                    password: this.registerForm.value.password
                }).subscribe({
                    next: (loginResponse) => {
                        this.isLoading = false;
                        const role = loginResponse.role || response.role;
                        this.redirectBasedOnRole(role);
                    },
                    error: () => {
                        this.isLoading = false;
                        this.router.navigate(['/login']);
                    }
                });
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
            }
        });
    }

    private redirectBasedOnRole(role: string) {
        switch (role) {
            case 'ADMIN':
                this.router.navigate(['/admin']);
                break;
            case 'APPROBATEUR':
                this.router.navigate(['/approbateur']);
                break;
            case 'EMPLOYE':
                this.router.navigate(['/feuilles-de-temps']);
                break;
            default:
                this.router.navigate(['/login']);
        }
    }
}