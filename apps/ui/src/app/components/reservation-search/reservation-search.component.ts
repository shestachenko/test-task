import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReservationService, ReservationBooking, DayBookings} from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-search.component.html',
  styleUrl: './reservation-search.component.scss',
})
export class ReservationSearchComponent {
  // By-day search
  amenityId = '';
  selectedDate: string = new Date().toISOString().split('T')[0];
  
  // By-user search
  userId = '';
  
  // Results
  byDayResults: ReservationBooking[] = [];
  byUserResults: DayBookings[] = [];
  
  // Loading and error states
  byDayLoading = false;
  byUserLoading = false;
  byDayError = '';
  byUserError = '';

  constructor(private reservationService: ReservationService) {}

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  searchByDay(): void {
    if (!this.amenityId.trim() || !this.selectedDate) {
      this.byDayError = 'Please fill in all fields';
      return;
    }

    this.byDayLoading = true;
    this.byDayError = '';
    this.byDayResults = [];

    this.reservationService.getReservationsByDay(this.amenityId.trim(), this.selectedDate).subscribe({
      next: (response) => {
        this.byDayLoading = false;
        if (response.success && response.data) {
          this.byDayResults = response.data;
        } else {
          this.byDayError = response.error || 'Failed to load reservations';
        }
      },
      error: (error) => {
        this.byDayLoading = false;
        this.byDayError = error.error?.error || 'An error occurred while searching';
      },
    });
  }

  searchByUser(): void {
    if (!this.userId.trim()) {
      this.byUserError = 'Please enter a user ID';
      return;
    }

    this.byUserLoading = true;
    this.byUserError = '';
    this.byUserResults = [];

    this.reservationService.getUserBookings(this.userId.trim()).subscribe({
      next: (response) => {
        this.byUserLoading = false;
        if (response.success && response.data) {
          this.byUserResults = response.data;
        } else {
          this.byUserError = response.error || 'Failed to load bookings';
        }
      },
      error: (error) => {
        this.byUserLoading = false;
        this.byUserError = error.error?.error || 'An error occurred while searching';
      },
    });
  }

  formatTime(time: string): string {
    return time;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins} min${mins !== 1 ? 's' : ''}`;
    }
    if (mins === 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hr ${mins} min${mins !== 1 ? 's' : ''}`;
  }
}

