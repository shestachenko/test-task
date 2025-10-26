import {Injectable} from '@nestjs/common';
import {ReservationRepository} from '../repositories/reservation.repository';
import {AmenityService} from '../../amenity/services/amenity.service';
import {ReservationBookingDto} from '../dto/reservation-booking.dto';
import {DayBookingsDto, ReservationInfoDto} from '../dto/user-bookings.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly amenityService: AmenityService
  ) {}

  async getReservationsByAmenityAndDate(amenityId: number, date: Date): Promise<ReservationBookingDto[]> {
    const reservations = await this.reservationRepository.findByAmenityAndDate(amenityId, date);

    // Get amenity details
    const amenity = await this.amenityService.findById(amenityId);
    if (!amenity) {
      return [];
    }

    // Transform to DTO format
    return reservations.map((reservation) => {
      const startMinutes = reservation.startTime;
      const hours = Math.floor(startMinutes / 60);
      const minutes = startMinutes % 60;
      const startTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const duration = reservation.endTime - reservation.startTime;

      return {
        reservationId: reservation._id.toString(),
        userId: reservation.userId,
        startTime: startTimeFormatted,
        duration,
        amenityName: amenity.name,
      };
    });
  }

  async getUserBookingsGroupedByDay(userId: number): Promise<DayBookingsDto[]> {
    const reservations = await this.reservationRepository.findByUserId(userId);

    // Group reservations by date
    const reservationsByDate = new Map<string, typeof reservations>();
    
    for (const reservation of reservations) {
      const dateKey = this.formatDate(reservation.date);
      if (!reservationsByDate.has(dateKey)) {
        reservationsByDate.set(dateKey, []);
      }
      const dateReservations = reservationsByDate.get(dateKey);
      if (dateReservations) {
        dateReservations.push(reservation);
      }
    }

    // Get all unique amenity IDs
    const uniqueAmenityIds = new Set(reservations.map(r => r.amenityId));
    
    // Fetch all amenities in parallel
    const amenityMap = new Map<number, string>();
    await Promise.all(
      Array.from(uniqueAmenityIds).map(async (amenityId) => {
        const amenity = await this.amenityService.findById(amenityId);
        if (amenity) {
          amenityMap.set(amenityId, amenity.name);
        }
      })
    );

    // Build the result
    const result: DayBookingsDto[] = [];
    for (const [date, reservationsForDate] of reservationsByDate.entries()) {
      const reservationsInfo: ReservationInfoDto[] = reservationsForDate.map((reservation): ReservationInfoDto => {
        const startMinutes = reservation.startTime;
        const hours = Math.floor(startMinutes / 60);
        const minutes = startMinutes % 60;
        const startTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        const duration = reservation.endTime - reservation.startTime;

        return {
          reservationId: reservation._id.toString(),
          startTime: startTimeFormatted,
          duration,
          amenityName: amenityMap.get(reservation.amenityId) || 'Unknown'
        };
      });

      result.push({
        date,
        reservations: reservationsInfo,
      });
    }

    // Sort by date (ascending)
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
