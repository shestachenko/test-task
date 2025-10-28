import {IsString, MinLength, IsNotEmpty, IsEmail, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {IUser} from '@red/shared';

export class RegisterUserDto implements IUser {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class RegisterDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user!: RegisterUserDto;
}

