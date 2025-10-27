import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {AmenityRepository} from './amenity.repository';
import {Amenity} from '../schemas/amenity.schema';

describe('AmenityRepository', () => {
  let repository: AmenityRepository;

  const mockModel = {
    findOne: jest.fn(),
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
    it('should find amenity by numericId', async () => {
      const mockAmenity = {
        _id: '507f1f77bcf86cd799439011',
        numericId: 1,
        name: 'Swimming Pool',
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockAmenity),
      };

      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findById(1);

      expect(result).toEqual(mockAmenity);
      expect(mockModel.findOne).toHaveBeenCalledWith({numericId: 1});
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return null when amenity not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findById(999);

      expect(result).toBeNull();
      expect(mockModel.findOne).toHaveBeenCalledWith({numericId: 999});
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
});

