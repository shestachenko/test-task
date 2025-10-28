import {Injectable} from '@nestjs/common';
import {ReservationRepository} from '../repositories/reservation.repository';
import {AmenityService} from '../../amenity/services/amenity.service';
import {UserService} from '../../user/services/user.service';
import {IReservationResultDto, IDayBookingsDto, IReservationInfoDto} from '@red/shared';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly amenityService: AmenityService,
    private readonly userService: UserService
  ) {}

  async getReservationsByAmenityAndDate(amenityId: string, date: Date): Promise<IReservationResultDto[]> {
    const reservations = await this.reservationRepository.findByAmenityAndDate(amenityId, date);

    // Get amenity details
    const amenity = await this.amenityService.findById(amenityId);
    if (!amenity) {
      return [];
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(reservations.map(r => r.userId))];
    
    // Fetch all users in parallel
    const userMap = new Map();
    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const user = await this.userService.findById(userId);
        if (user) {
          // Convert to plain object with string _id
          const userPlain = user.toObject();
          userMap.set(userId, {
            ...userPlain,
            _id: user._id.toString()
          });
        }
      })
    );

    // Convert amenity to plain object
    const amenityPlain = amenity.toObject();

    // Transform to DTO format
    return reservations.map((reservation) => {
      const startMinutes = reservation.startTime;
      const hours = Math.floor(startMinutes / 60);
      const minutes = startMinutes % 60;
      const startTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const duration = reservation.endTime - reservation.startTime;

      return {
        reservationId: reservation._id.toString(),
        user: userMap.get(reservation.userId) || null,
        startTime: startTimeFormatted,
        duration,
        amenity: {
          ...amenityPlain,
          _id: amenity._id.toString()
        },
      };
    });
  }

  async getUserBookingsGroupedByDay(userId: string): Promise<IDayBookingsDto[]> {
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
    const amenityMap = new Map();
    await Promise.all(
      Array.from(uniqueAmenityIds).map(async (amenityId) => {
        const amenity = await this.amenityService.findById(amenityId);
        if (amenity) {
          // Convert to plain object with string _id
          const amenityPlain = amenity.toObject();
          amenityMap.set(amenityId, {
            ...amenityPlain,
            _id: amenity._id.toString()
          });
        }
      })
    );

    // Build the result
    const result: IDayBookingsDto[] = [];
    for (const [date, reservationsForDate] of reservationsByDate.entries()) {
      const reservationsInfo: IReservationInfoDto[] = reservationsForDate.map((reservation): IReservationInfoDto => {
        const startMinutes = reservation.startTime;
        const hours = Math.floor(startMinutes / 60);
        const minutes = startMinutes % 60;
        const startTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        const duration = reservation.endTime - reservation.startTime;

        return {
          reservationId: reservation._id.toString(),
          startTime: startTimeFormatted,
          duration,
          amenity: amenityMap.get(reservation.amenityId) || null
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
