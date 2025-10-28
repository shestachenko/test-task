import {Test, TestingModule} from '@nestjs/testing';
import {ConflictException, UnauthorizedException} from '@nestjs/common';
import {UserService} from './user.service';
import {UserRepository} from '../repositories/user.repository';
import {IRegisterDto} from '@red/shared';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: IRegisterDto = {
        user: {
          username: 'testuser',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
        }
      };

      const mockUser = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        username: 'testuser',
        password: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        validatePassword: jest.fn(),
      } as any;

      mockRepository.findByUsername.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockRepository.create).toHaveBeenCalledWith({
        username: registerDto.user.username,
        password: registerDto.user.password,
        first_name: registerDto.user.first_name,
        last_name: registerDto.user.last_name,
        email: registerDto.user.email,
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      const registerDto: IRegisterDto = {
        user: {
          username: 'existinguser',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
        }
      };

      const existingUser = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        username: 'existinguser',
        password: 'hashed_password',
        first_name: 'Existing',
        last_name: 'User',
        email: 'existing@example.com',
      } as any;

      mockRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('Username already exists');
      expect(mockRepository.findByUsername).toHaveBeenCalledWith('existinguser');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const username = 'testuser';
      const password = 'password123';

      const mockUser = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        username: 'testuser',
        password: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        validatePassword: jest.fn().mockResolvedValue(true),
      } as any;

      mockRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await service.login(username, password);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const username = 'nonexistent';
      const password = 'password123';

      mockRepository.findByUsername.mockResolvedValue(null);

      await expect(service.login(username, password)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(username, password)).rejects.toThrow('Invalid username or password');
      expect(mockRepository.findByUsername).toHaveBeenCalledWith(username);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      const mockUser = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        username: 'testuser',
        password: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        validatePassword: jest.fn().mockResolvedValue(false),
      } as any;

      mockRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.login(username, password)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(username, password)).rejects.toThrow('Invalid username or password');
      expect(mockRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
    });
  });
});
