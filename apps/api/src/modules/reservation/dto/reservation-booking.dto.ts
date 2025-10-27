export class ReservationBookingDto {
  reservationId: string;
  userId: string;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenityName: string;
}

