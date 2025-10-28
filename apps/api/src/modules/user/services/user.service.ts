import {Injectable, UnauthorizedException, ConflictException} from '@nestjs/common';
import {UserRepository} from '../repositories/user.repository';
import {RegisterDto} from '@red/shared';
import {UserDocument} from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Create new user
    return await this.userRepository.create({
      username: registerDto.username,
      password: registerDto.password, // Will be hashed by pre-save hook
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      email: registerDto.email,
    });
  }

  async login(username: string, password: string): Promise<UserDocument> {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }
}

