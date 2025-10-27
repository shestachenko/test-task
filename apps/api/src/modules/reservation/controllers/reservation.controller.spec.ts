import {Test, TestingModule} from '@nestjs/testing';
import {ReservationController} from './reservation.controller';
import {ReservationService} from '../services/reservation.service';
import {AmenityService} from '../../amenity/services/amenity.service';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    getReservationsByAmenityAndDate: jest.fn(),
    getUserBookingsGroupedByDay: jest.fn(),
  };

  const mockAmenityService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
        {
          provide: AmenityService,
          useValue: mockAmenityService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReservationsByDay', () => {
    it('should successfully get reservations by day', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const dateString = '2024-01-15';
      const mockReservations = [
        {
          reservationId: 'res1',
          userId: 1,
          startTime: '09:00',
          duration: 60,
          amenityName: 'Tennis Court',
        },
        {
          reservationId: 'res2',
          userId: 2,
          startTime: '10:00',
          duration: 90,
          amenityName: 'Tennis Court',
        },
      ];

      mockReservationService.getReservationsByAmenityAndDate.mockResolvedValue(
        mockReservations,
      );

      const result = await controller.getReservationsByDay(
        amenityId,
        dateString,
      );

      expect(
        service.getReservationsByAmenityAndDate,
      ).toHaveBeenCalledWith(amenityId, expect.any(Date));
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockReservations);
    });

    it('should return fail response for invalid date format', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const dateString = 'invalid-date';

      const result = await controller.getReservationsByDay(
        amenityId,
        dateString,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid date format');
    });

    it('should propagate error when service throws error', async () => {
      const amenityId = '507f1f77bcf86cd799439011';
      const dateString = '2024-01-15';

      mockReservationService.getReservationsByAmenityAndDate.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getReservationsByDay(amenityId, dateString)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getUserBookings', () => {
    it('should successfully get user bookings', async () => {
      const userId = '507f1f77bcf86cd799439021';
      const mockBookings = [
        {
          date: '2024-01-15',
          reservations: [
            {
              reservationId: 'res1',
              startTime: '09:00',
              duration: 60,
              amenityName: 'Tennis Court',
            },
            {
              reservationId: 'res2',
              startTime: '11:00',
              duration: 90,
              amenityName: 'Swimming Pool',
            },
          ],
        },
        {
          date: '2024-01-16',
          reservations: [
            {
              reservationId: 'res3',
              startTime: '14:00',
              duration: 120,
              amenityName: 'Gym',
            },
          ],
        },
      ];

      mockReservationService.getUserBookingsGroupedByDay.mockResolvedValue(
        mockBookings,
      );

      const result = await controller.getUserBookings(userId);

      expect(service.getUserBookingsGroupedByDay).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBookings);
    });

    it('should propagate error when service throws error', async () => {
      const userId = '507f1f77bcf86cd799439999';

      mockReservationService.getUserBookingsGroupedByDay.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getUserBookings(userId)).rejects.toThrow(
        'Database error',
      );
    });

    it('should return empty array when user has no bookings', async () => {
      const userId = '507f1f77bcf86cd799439100';
      const mockBookings: any[] = [];

      mockReservationService.getUserBookingsGroupedByDay.mockResolvedValue(
        mockBookings,
      );

      const result = await controller.getUserBookings(userId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });
});
