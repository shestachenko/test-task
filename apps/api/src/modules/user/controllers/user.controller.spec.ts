import {Test, TestingModule} from '@nestjs/testing';
import {ConflictException, UnauthorizedException} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from '../services/user.service';
import {RegisterDto, LoginDto} from '@red/shared';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockRequest = {
    session: {},
  } as any;

  const mockUser = {
    _id: {
      toString: () => 'user123',
    },
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'hashedpassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user and create session', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'newuser',
          password: 'password123',
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@example.com',
        }
      };

      mockUserService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto, mockRequest);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(mockRequest.session.userId).toBe('user123');
      expect(mockRequest.session.username).toBe('testuser');
      expect(mockRequest.session.email).toBe('test@example.com');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: {
          _id: 'user123',
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
        }
      });
    });

    it('should return fail response if username already exists', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'existinguser',
          password: 'password123',
          first_name: 'Existing',
          last_name: 'User',
          email: 'existing@example.com',
        }
      };

      mockUserService.register.mockRejectedValue(
        new ConflictException('Username already exists'),
      );

      const result = await controller.register(registerDto, mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
    });

    it('should return fail response on general registration failure', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'testuser',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
        }
      };

      mockUserService.register.mockRejectedValue(new Error('Database error'));

      const result = await controller.register(registerDto, mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration failed');
    });
  });

  describe('login', () => {
    it('should successfully login a user and create session', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockUserService.login.mockResolvedValue(mockUser);

      const result = await controller.login(loginDto, mockRequest);

      expect(service.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockRequest.session.userId).toBe('user123');
      expect(mockRequest.session.username).toBe('testuser');
      expect(mockRequest.session.email).toBe('test@example.com');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: {
          _id: 'user123',
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
        }
      });
    });

    it('should return fail response for invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'wronguser',
        password: 'wrongpass',
      };

      mockUserService.login.mockRejectedValue(
        new UnauthorizedException('Invalid username or password'),
      );

      const result = await controller.login(loginDto, mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password');
    });

    it('should return fail response on general login failure', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockUserService.login.mockRejectedValue(new Error('Database error'));

      const result = await controller.login(loginDto, mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Login failed');
    });
  });

  describe('logout', () => {
    it('should successfully logout and destroy session', async () => {
      mockRequest.session.userId = 'user123';
      mockRequest.session.destroy = jest.fn((callback) => {
        callback(null);
      });

      const result = await controller.logout(mockRequest);

      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data?.message).toBe('Logged out successfully');
    });

    it('should return fail response if logout fails', async () => {
      mockRequest.session.destroy = jest.fn((callback) => {
        callback(new Error('Destroy failed'));
      });

      const result = await controller.logout(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Logout failed');
    });
  });
});
