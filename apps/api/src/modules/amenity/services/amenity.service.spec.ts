import {Test, TestingModule} from '@nestjs/testing';
import {AmenityService} from './amenity.service';
import {AmenityRepository} from '../repositories/amenity.repository';

describe('AmenityService', () => {
  let service: AmenityService;
  let repository: AmenityRepository;

  const mockRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmenityService,
        {
          provide: AmenityRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AmenityService>(AmenityService);
    repository = module.get<AmenityRepository>(AmenityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return an amenity when found', async () => {
      const mockAmenity = {
        _id: '507f1f77bcf86cd799439011',
        numericId: 1,
        name: 'Swimming Pool',
      };

      mockRepository.findById.mockResolvedValue(mockAmenity);

      const result = await service.findById(1);

      expect(result).toEqual(mockAmenity);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when amenity not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
