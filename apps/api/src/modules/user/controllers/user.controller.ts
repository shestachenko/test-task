import {Controller, Post, Body, HttpCode, HttpStatus, ConflictException, UnauthorizedException, Req} from '@nestjs/common';
import {Request} from 'express';
import {UserService} from '../services/user.service';
import {RegisterDto, LoginDto, AuthResponseDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Req() req: Request): Promise<BaseResponseDto<AuthResponseDto>> {
    try {
      const user = await this.userService.register(registerDto);
      
      // Save user data in session
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      req.session.email = user.email;
      
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
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<BaseResponseDto<AuthResponseDto>> {
    try {
      const user = await this.userService.login(loginDto.username, loginDto.password);
      
      // Save user data in session
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      req.session.email = user.email;
      
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request): Promise<BaseResponseDto<{message: string}>> {
    req.session.destroy((err) => {
      if (err) {
        return BaseResponseDto.fail<{message: string}>('Logout failed');
      }
    });
    
    return BaseResponseDto.ok<{message: string}>({message: 'Logged out successfully'});
  }
}

