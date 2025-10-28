import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser, IAmenity} from '@red/shared';

interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ReservationBooking {
  reservationId: string;
  user: IUser | null;
  startTime: string;
  duration: number;
  amenity: IAmenity;
}

export interface ReservationInfo {
  reservationId: string;
  startTime: string;
  duration: number;
  amenity: IAmenity | null;
}

export interface DayBookings {
  date: string;
  reservations: ReservationInfo[];
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/reservations';

  getReservationsByDay(amenityId: string, date: string): Observable<BaseResponse<ReservationBooking[]>> {
    const params = new HttpParams()
      .set('amenityId', amenityId)
      .set('date', date);
    
    return this.http.get<BaseResponse<ReservationBooking[]>>(`${this.apiUrl}/by-day`, {params});
  }

  getUserBookings(userId: string): Observable<BaseResponse<DayBookings[]>> {
    const params = new HttpParams().set('userId', userId);
    
    return this.http.get<BaseResponse<DayBookings[]>>(`${this.apiUrl}/by-user`, {params});
  }
}

