import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Form fields
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  email = '';
  
  // UI state
  isRegisterMode = false;
  error = '';
  loading = false;

  private authService = inject(AuthService);

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.clearFields();
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    if (this.isRegisterMode) {
      this.register();
    } else {
      this.login();
    }
  }

  private login(): void {
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          console.log('Login successful:', response.data);
        } else {
          this.error = response.error || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to connect to server';
      },
    });
  }

  private register(): void {
    this.authService.register({
      user: {
        username: this.username,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
      }
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          console.log('Registration successful:', response.data);
        } else {
          this.error = response.error || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to connect to server';
      },
    });
  }

  private clearFields(): void {
    this.username = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
  }
}
