import {IsString, IsNotEmpty, IsMongoId} from 'class-validator';

export class GetReservationsByDayDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  amenityId!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;
}

