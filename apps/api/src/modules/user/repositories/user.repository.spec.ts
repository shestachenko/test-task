import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {UserRepository} from './user.repository';
import {User} from '../schemas/user.schema';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = jest.fn();
    mockModel.findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        password: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUser),
      };

      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockModel.findOne).toHaveBeenCalledWith({username: 'testuser'});
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByUsername('nonexistent');

      expect(result).toBeNull();
      expect(mockModel.findOne).toHaveBeenCalledWith({username: 'nonexistent'});
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        password: 'password123',
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
      };

      const mockSavedUser = {
        _id: '507f1f77bcf86cd799439011',
        ...userData,
      };

      const mockUserInstance = {
        save: jest.fn().mockResolvedValue(mockSavedUser),
      };

      // Mock the constructor to return our mock instance
      mockModel.mockImplementation(() => mockUserInstance);

      const result = await repository.create(userData);

      expect(result).toEqual(mockSavedUser);
      expect(mockModel).toHaveBeenCalledWith(userData);
      expect(mockUserInstance.save).toHaveBeenCalled();
    });
  });
});

