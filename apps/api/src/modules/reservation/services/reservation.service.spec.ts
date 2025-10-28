import {Test, TestingModule} from '@nestjs/testing';
import {ReservationService} from './reservation.service';
import {ReservationRepository} from '../repositories/reservation.repository';
import {AmenityService} from '../../amenity/services/amenity.service';
import {UserService} from '../../user/services/user.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: ReservationRepository;
  let amenityService: AmenityService;
  let userService: UserService;

  const mockReservationRepository = {
    findByAmenityAndDate: jest.fn(),
    findByUserId: jest.fn(),
  };

  const mockAmenityService = {
    findById: jest.fn(),
  };

  const mockUserService = {
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
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<ReservationRepository>(ReservationRepository);
    amenityService = module.get<AmenityService>(AmenityService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReservationsByAmenityAndDate', () => {
    it('should return reservations for amenity and date', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        name: 'Swimming Pool',
        toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Swimming Pool'}),
      };

      const mockUser = {
        _id: {toString: () => '507f1f77bcf86cd799439021'},
        first_name: 'John',
        last_name: 'Doe',
        toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439021'}, first_name: 'John', last_name: 'Doe'}),
      };

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 480, // 8:00 AM
          endTime: 540,   // 9:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: '507f1f77bcf86cd799439022',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 600, // 10:00 AM
          endTime: 660,   // 11:00 AM
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result).toHaveLength(2);
      expect(result[0].reservationId).toBe('reservation1');
      expect(result[0].startTime).toBe('08:00');
      expect(result[0].duration).toBe(60);
      expect(result[0].amenity).toBeDefined();
      expect(result[0].user).toBeDefined();
      expect(mockReservationRepository.findByAmenityAndDate).toHaveBeenCalledWith(amenityId, date);
      expect(mockAmenityService.findById).toHaveBeenCalledWith(amenityId);
    });

    it('should return empty array when amenity not found', async () => {
      const amenityId = '507f1f77bcf86cd799439999';
      const date = new Date('2024-01-15');

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: 1,
          amenityId: '507f1f77bcf86cd799439999',
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
      const amenityId = '507f1f77bcf86cd799439011';
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        name: 'Swimming Pool',
        toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Swimming Pool'}),
      };

      mockReservationRepository.findByAmenityAndDate.mockResolvedValue([]);
      mockAmenityService.findById.mockResolvedValue(mockAmenity);

      const result = await service.getReservationsByAmenityAndDate(amenityId, date);

      expect(result).toEqual([]);
    });

    it('should handle single digit hours and minutes', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const date = new Date('2024-01-15');

      const mockAmenity = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        name: 'Tennis Court',
        toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Tennis Court'}),
      };

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
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
      const userId = '507f1f77bcf86cd799439021';

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 480,  // 8:00 AM
          endTime: 540,    // 9:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439012',
          startTime: 600,  // 10:00 AM
          endTime: 660,    // 11:00 AM
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation3'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 720,  // 12:00 PM
          endTime: 780,    // 1:00 PM
          date: new Date('2024-01-16'),
        },
      ];

      const mockAmenities = [
        {_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Swimming Pool', toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Swimming Pool'})},
        {_id: {toString: () => '507f1f77bcf86cd799439012'}, name: 'Tennis Court', toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439012'}, name: 'Tennis Court'})},
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

      expect(result[0].reservations[0].reservationId).toBe('reservation1');
      expect(result[0].reservations[0].startTime).toBe('08:00');
      expect(result[0].reservations[0].duration).toBe(60);
      expect(result[0].reservations[0].amenity).toBeDefined();
      expect(result[0].reservations[1].reservationId).toBe('reservation2');
      expect(result[0].reservations[1].startTime).toBe('10:00');
      expect(result[0].reservations[1].duration).toBe(60);
      expect(result[0].reservations[1].amenity).toBeDefined();
    });

    it('should return empty array when no reservations found', async () => {
      const userId = '507f1f77bcf86cd799439999';

      mockReservationRepository.findByUserId.mockResolvedValue([]);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toEqual([]);
    });

    it('should sort days in ascending order', async () => {
      const userId = '507f1f77bcf86cd799439021';

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-17'),
        },
        {
          _id: {toString: () => 'reservation2'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 600,
          endTime: 660,
          date: new Date('2024-01-15'),
        },
        {
          _id: {toString: () => 'reservation3'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439011',
          startTime: 720,
          endTime: 780,
          date: new Date('2024-01-16'),
        },
      ];

      const mockAmenity = {
        _id: {toString: () => '507f1f77bcf86cd799439011'},
        name: 'Swimming Pool',
        toObject: () => ({_id: {toString: () => '507f1f77bcf86cd799439011'}, name: 'Swimming Pool'}),
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
      const userId = '507f1f77bcf86cd799439021';

      const mockReservations = [
        {
          _id: {toString: () => 'reservation1'},
          userId: '507f1f77bcf86cd799439021',
          amenityId: '507f1f77bcf86cd799439999',
          startTime: 480,
          endTime: 540,
          date: new Date('2024-01-15'),
        },
      ];

      mockReservationRepository.findByUserId.mockResolvedValue(mockReservations);
      mockAmenityService.findById.mockResolvedValue(null);

      const result = await service.getUserBookingsGroupedByDay(userId);

      expect(result).toHaveLength(1);
      expect(result[0].reservations[0].amenity).toBeNull();
    });
  });
});

