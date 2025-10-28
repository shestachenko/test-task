import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {AuthResponseDto} from '@red/shared';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: AuthResponseDto|null = null;
  private subscription = new Subscription();
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (): void => {
        console.log('Logout successful');
      },
      error: (err): void => {
        console.error('Logout error:', err);
      },
    });
  }
}

