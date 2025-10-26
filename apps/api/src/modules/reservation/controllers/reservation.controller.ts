import {Controller, Get, Query, ParseIntPipe} from '@nestjs/common';
import {ReservationService} from '../services/reservation.service';
import {ReservationBookingDto} from '../dto/reservation-booking.dto';
import {DayBookingsDto} from '../dto/user-bookings.dto';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('by-day')
  async getReservationsByDay(
    @Query('amenityId', ParseIntPipe) amenityId: number,
    @Query('date') dateString: string,
  ): Promise<BaseResponseDto<ReservationBookingDto[]>> {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return BaseResponseDto.fail<ReservationBookingDto[]>('Invalid date format');
    }
    const reservations = await this.reservationService.getReservationsByAmenityAndDate(amenityId, date);

    return BaseResponseDto.ok<ReservationBookingDto[]>(reservations);
  }

  @Get('by-user')
  async getUserBookings(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponseDto<DayBookingsDto[]>> {
    const bookings = await this.reservationService.getUserBookingsGroupedByDay(userId);

    return BaseResponseDto.ok<DayBookingsDto[]>(bookings);
  }
}
