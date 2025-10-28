import {Controller, Post, Body, HttpCode, HttpStatus, ConflictException, UnauthorizedException, Req} from '@nestjs/common';
import {Request} from 'express';
import {UserService} from '../services/user.service';
import {IAuthResponseDto} from '@red/shared';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';
import {RegisterDto, LoginDto} from '../dto';
import '../../../common/types/session.types';
import {UserDocument} from '../schemas/user.schema';

interface AuthenticatedRequest extends Request {
  session: {
    userId?: string;
    username?: string;
    email?: string;
    destroy: (callback: (err?: Error) => void) => void;
  };
}

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Req() req: AuthenticatedRequest): Promise<BaseResponseDto<IAuthResponseDto>> {
    try {
      const user = await this.userService.register(registerDto);
      this.saveUserToSession(user, req);
      const response: IAuthResponseDto = {
        user: {
          _id: user._id.toString(),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }
      }

      return BaseResponseDto.ok<IAuthResponseDto>(response);
    } catch (error) {
      if (error instanceof ConflictException) {
        return BaseResponseDto.fail<IAuthResponseDto>(error.message);
      }
      return BaseResponseDto.fail<IAuthResponseDto>('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: AuthenticatedRequest): Promise<BaseResponseDto<IAuthResponseDto>> {
    try {
      const user = await this.userService.login(loginDto.username, loginDto.password);
      this.saveUserToSession(user, req);
      const response: IAuthResponseDto = {
        user: {
          _id: user._id.toString(),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }
      }

      return BaseResponseDto.ok<IAuthResponseDto>(response);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return BaseResponseDto.fail<IAuthResponseDto>(error.message);
      }
      return BaseResponseDto.fail<IAuthResponseDto>('Login failed');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: AuthenticatedRequest): Promise<BaseResponseDto<{message: string}>> {
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
  private saveUserToSession(user: UserDocument, req: AuthenticatedRequest): void {
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.email = user.email;
  }
}

