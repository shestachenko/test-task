import {IsString, IsNotEmpty, IsMongoId} from 'class-validator';

export class GetUserBookingsDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

