import {Controller, Post, Body, HttpCode, HttpStatus, ConflictException, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {RegisterDto, LoginDto, AuthResponseDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<BaseResponseDto<AuthResponseDto>> {
    try {
      const user = await this.userService.register(registerDto);
      
      const response: AuthResponseDto = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      };

      return BaseResponseDto.ok<AuthResponseDto>(response);
    } catch (error) {
      if (error instanceof ConflictException) {
        return BaseResponseDto.fail<AuthResponseDto>(error.message);
      }
      return BaseResponseDto.fail<AuthResponseDto>('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<BaseResponseDto<AuthResponseDto>> {
    try {
      const user = await this.userService.login(loginDto.username, loginDto.password);
      
      const response: AuthResponseDto = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      };

      return BaseResponseDto.ok<AuthResponseDto>(response);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return BaseResponseDto.fail<AuthResponseDto>(error.message);
      }
      return BaseResponseDto.fail<AuthResponseDto>('Login failed');
    }
  }
}

