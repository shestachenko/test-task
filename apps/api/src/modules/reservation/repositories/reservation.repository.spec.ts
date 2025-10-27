import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {ReservationRepository} from './reservation.repository';
import {Reservation} from '../schemas/reservation.schema';

describe('ReservationRepository', () => {
  let repository: ReservationRepository;

  const mockModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationRepository,
        {
          provide: getModelToken(Reservation.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<ReservationRepository>(ReservationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByAmenityAndDate', () => {
    it('should find reservations by amenity and date', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const date = new Date('2024-01-15');
      const expectedStart = new Date('2024-01-15');
      expectedStart.setHours(0, 0, 0, 0);
      const expectedEnd = new Date('2024-01-15');
      expectedEnd.setHours(23, 59, 59, 999);

      const mockReservations = [
        {
          _id: 'reservation1',
          amenityId: '507f1f77bcf86cd799439011',
          userId: '507f1f77bcf86cd799439021',
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-15'),
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReservations),
      };

      mockModel.find.mockReturnValue(mockQuery);

      const result = await repository.findByAmenityAndDate(amenityId, date);

      expect(result).toEqual(mockReservations);
      expect(mockModel.find).toHaveBeenCalledWith({amenityId, date: {$gte: expectedStart, $lte: expectedEnd}});
      expect(mockQuery.sort).toHaveBeenCalledWith({startTime: 1});
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return empty array when no reservations found', async () => {
      const amenityId = '507f1f77bcf86cd799439999';
      const date = new Date('2024-01-15');

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockModel.find.mockReturnValue(mockQuery);

      const result = await repository.findByAmenityAndDate(amenityId, date);

      expect(result).toEqual([]);
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should find reservations by user id', async () => {
      const userId = '507f1f77bcf86cd799439021';

      const mockReservations = [
        {
          _id: 'reservation1',
          amenityId: '507f1f77bcf86cd799439011',
          userId: '507f1f77bcf86cd799439021',
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-15'),
        },
        {
          _id: 'reservation2',
          amenityId: '507f1f77bcf86cd799439012',
          userId: '507f1f77bcf86cd799439021',
          startTime: 600,
          endTime: 660,
          date: new Date('2024-01-16'),
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReservations),
      };

      mockModel.find.mockReturnValue(mockQuery);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual(mockReservations);
      expect(mockModel.find).toHaveBeenCalledWith({userId});
      expect(mockQuery.sort).toHaveBeenCalledWith({date: 1, startTime: 1});
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return empty array when user has no reservations', async () => {
      const userId = '507f1f77bcf86cd799439999';

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockModel.find.mockReturnValue(mockQuery);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual([]);
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
});

