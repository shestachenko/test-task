import {ILoginDto} from '@red/shared';
import {IsString, MinLength, IsNotEmpty} from 'class-validator';

export class LoginDto implements ILoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}

