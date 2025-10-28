import {Controller, Post, Body, HttpCode, HttpStatus, ConflictException, UnauthorizedException, Req} from '@nestjs/common';
import {Request} from 'express';
import {UserService} from '../services/user.service';
import {RegisterDto, LoginDto, AuthResponseDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';
import '../../../common/types/session.types';
import {UserDocument} from '../schemas/user.schema';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Req() req: Request): Promise<BaseResponseDto<AuthResponseDto>> {
    try {
      const user = await this.userService.register(registerDto);
      this.saveUserToSession(user, req);
      const response: AuthResponseDto = {
        user: {
          _id: user._id.toString(),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }
      }

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
      this.saveUserToSession(user, req);
      const response: AuthResponseDto = {
        user: {
          _id: user._id.toString(),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }
      }

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
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          resolve(BaseResponseDto.fail<{message: string}>('Logout failed'));
        } else {
          resolve(BaseResponseDto.ok<{message: string}>({message: 'Logged out successfully'}));
        }
      });
    });
  }

  /**
   * Helper method to save user data to session and create AuthResponse
   */
  private saveUserToSession(user: UserDocument, req: Request): void {
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.email = user.email;
  }
}

