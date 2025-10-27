import {Test, TestingModule} from '@nestjs/testing';
import {ReservationService} from './reservation.service';
import {ReservationRepository} from '../repositories/reservation.repository';
import {AmenityService} from '../../amenity/services/amenity.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: ReservationRepository;
  let amenityService: AmenityService;

  const mockReservationRepository = {
    findByAmenityAndDate: jest.fn(),
    findByUserId: jest.fn(),
  };

  const mockAmenityService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationRepository,
          useValue: mockReservationRepository,
        },
        {
          provide: AmenityService,
          useValue: mockAmenityService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<ReservationRepository>(ReservationRepository);
    amenityService = module.get<AmenityService>(AmenityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReservationsByAmenityAndDate', () => {
    it('should return reservations for amenity and date', async () => {
      const amenityId = 1;
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: 'amenity123',
        numericId: 1,
        name: 'Swimming Pool',
      };

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 1,
          startTime: 480, // 8:00 AM
          endTime: 540,   // 9:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: 2,
          amenityId: 1,
          startTime: 600, // 10:00 AM
          endTime: 660,   // 11:00 AM
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({reservationId: 'reservation1', userId: 1, startTime: '08:00', duration: 60, amenityName: 'Swimming Pool'});
      expect(result[1]).toEqual({reservationId: 'reservation2', userId: 2, startTime: '10:00', duration: 60, amenityName: 'Swimming Pool'});
      expect(mockReservationRepository.findByAmenityAndDate).toHaveBeenCalledWith(amenityId, date);
      expect(mockAmenityService.findById).toHaveBeenCalledWith(amenityId);
    });

    it('should return empty array when amenity not found', async () => {
      const amenityId = 999;
      const date = new Date('2024-01-15');

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 999,
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(null);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result).toEqual([]);
    });

    it('should return empty array when no reservations found', async () => {
      const amenityId = 1;
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: 'amenity123',
        numericId: 1,
        name: 'Swimming Pool',
      };

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue([]);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result).toEqual([]);
    });

    it('should handle single digit hours and minutes', async () => {
      const amenityId = 1;
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: 'amenity123',
        numericId: 1,
        name: 'Tennis Court',
      };

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 1,
          startTime: 30,   // 0:30 AM
          endTime: 60,     // 1:00 AM
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result[0].startTime).toBe('00:30');
    });
  });

  describe('getUserBookingsGroupedByDay', () => {
    it('should return user bookings grouped by day', async () => {
      const userId = 1;

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 1,
          startTime: 480,  // 8:00 AM
          endTime: 540,    // 9:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: 1,
          amenityId: 2,
          startTime: 600,  // 10:00 AM
          endTime: 660,    // 11:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation3'},
          userId: 1,
          amenityId: 1,
          startTime: 720,  // 12:00 PM
          endTime: 780,    // 1:00 PM
          date: new Date('2024-01-16'),
        },
      ];

      const mockAmenities = [
        {_id: 'amenity1', numericId: 1, name: 'Swimming Pool'},
        {_id: 'amenity2', numericId: 2, name: 'Tennis Court'},
      ];

      mockReservationRepository.findByUserId.mockResolvedValue(mockReservations);
      mockAmenityService.findById
        .mockResolvedValueOnce(mockAmenities[0])
        .mockResolvedValueOnce(mockAmenities[1])
        .mockResolvedValueOnce(mockAmenities[0]);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].reservations).toHaveLength(2);
      expect(result[1].date).toBe('2024-01-16');
      expect(result[1].reservations).toHaveLength(1);

      expect(result[0].reservations[0]).toEqual({reservationId: 'reservation1', startTime: '08:00', duration: 60, amenityName: 'Swimming Pool'});
      expect(result[0].reservations[1]).toEqual({reservationId: 'reservation2', startTime: '10:00', duration: 60, amenityName: 'Tennis Court'});
    });

    it('should return empty array when no reservations found', async () => {
      const userId = 999;

      mockReservationRepository.findByUserId.mockResolvedValue([]);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toEqual([]);
    });

    it('should sort days in ascending order', async () => {
      const userId = 1;

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 1,
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-17'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: 1,
          amenityId: 1,
          startTime: 600,
          endTime: 660,
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation3'},
          userId: 1,
          amenityId: 1,
          startTime: 720,
          endTime: 780,
          date: new Date('2024-01-16'),
        },
      ];

      const mockAmenity = {
        _id: 'amenity1',
        numericId: 1,
        name: 'Swimming Pool',
      };

      mockReservationRepository.findByUserId.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2024-01-15');
      expect(result[1].date).toBe('2024-01-16');
      expect(result[2].date).toBe('2024-01-17');
    });

    it('should handle unknown amenities gracefully', async () => {
      const userId = 1;

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: 999,
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByUserId.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(null);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toHaveLength(1);
      expect(result[0].reservations[0].amenityName).toBe('Unknown');
    });
  });
});

