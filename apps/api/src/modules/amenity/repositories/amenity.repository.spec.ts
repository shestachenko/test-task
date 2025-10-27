import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {AmenityRepository} from './amenity.repository';
import {Amenity} from '../schemas/amenity.schema';

describe('AmenityRepository', () => {
  let repository: AmenityRepository;

  const mockModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmenityRepository,
        {
          provide: getModelToken(Amenity.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<AmenityRepository>(AmenityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should find amenity by id', async () => {
      const mockAmenity = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Swimming Pool',
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockAmenity),
      };

      mockModel.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await repository.findById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockAmenity);
      expect(mockModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return null when amenity not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockModel.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await repository.findById('507f1f77bcf86cd799439999');

      expect(result).toBeNull();
      expect(mockModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
});

