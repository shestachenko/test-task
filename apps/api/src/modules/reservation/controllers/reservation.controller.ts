import {Controller, Get, Query} from '@nestjs/common';
import {ReservationService} from '../services/reservation.service';
import {ReservationResultDto, DayBookingsDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('by-day')
  async getReservationsByDay(
    @Query('amenityId') amenityId: string,
    @Query('date') dateString: string,
  ): Promise<BaseResponseDto<ReservationResultDto[]>> {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return BaseResponseDto.fail<ReservationResultDto[]>('Invalid date format');
    }
    const reservations = await this.reservationService.getReservationsByAmenityAndDate(amenityId, date);

    return BaseResponseDto.ok<ReservationResultDto[]>(reservations);
  }

  @Get('by-user')
  async getUserBookings(
    @Query('userId') userId: string,
  ): Promise<BaseResponseDto<DayBookingsDto[]>> {
    const bookings = await this.reservationService.getUserBookingsGroupedByDay(userId);

    return BaseResponseDto.ok<DayBookingsDto[]>(bookings);
  }
}
