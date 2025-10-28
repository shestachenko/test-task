import {Controller, Get, Query} from '@nestjs/common';
import {ReservationService} from '../services/reservation.service';
import {IReservationResultDto, IDayBookingsDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';
import {GetReservationsByDayDto, GetUserBookingsDto} from '../dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('by-day')
  async getReservationsByDay(
    @Query() query: GetReservationsByDayDto,
  ): Promise<BaseResponseDto<IReservationResultDto[]>> {
    const date = new Date(query.date);
    
    if (isNaN(date.getTime())) {
      return BaseResponseDto.fail<IReservationResultDto[]>('Invalid date format');
    }
    const reservations = await this.reservationService.getReservationsByAmenityAndDate(query.amenityId, date);

    return BaseResponseDto.ok<IReservationResultDto[]>(reservations);
  }

  @Get('by-user')
  async getUserBookings(
    @Query() query: GetUserBookingsDto
  ): Promise<BaseResponseDto<IDayBookingsDto[]>> {    
    const bookings = await this.reservationService.getUserBookingsGroupedByDay(query.userId);

    return BaseResponseDto.ok<IDayBookingsDto[]>(bookings);
  }
}
