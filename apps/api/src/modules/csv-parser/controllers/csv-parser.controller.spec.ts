import {Test, TestingModule} from '@nestjs/testing';
import {BadRequestException} from '@nestjs/common';
import {CsvParserController} from './csv-parser.controller';
import {CsvParserService} from '../services/csv-parser.service';

describe('CsvParserController', () => {
  let controller: CsvParserController;
  let service: CsvParserService;

  const mockCsvParserService = {
    parseCsv: jest.fn(),
  };

  const mockBuffer = Buffer.from('name;email\nJohn;john@example.com');

  const mockFile = {
    originalname: 'test.csv',
    mimetype: 'text/csv',
    size: 1024,
    buffer: mockBuffer,
    fieldname: 'file',
    encoding: '7bit',
    destination: '',
    filename: '',
    path: '',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvParserController],
      providers: [
        {
          provide: CsvParserService,
          useValue: mockCsvParserService,
        },
      ],
    }).compile();

    controller = module.get<CsvParserController>(CsvParserController);
    service = module.get<CsvParserService>(CsvParserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseCsv', () => {
    it('should successfully parse a CSV file', async () => {
      const mockParsedData = [
        {name: 'John', email: 'john@example.com'},
      ];
      mockCsvParserService.parseCsv.mockReturnValue(mockParsedData);

      const result = await controller.parseCsv(mockFile);

      expect(service.parseCsv).toHaveBeenCalledWith(mockBuffer);
      expect(result).toEqual(mockParsedData);
    });

    it('should throw BadRequestException when no file is uploaded', async () => {
      await expect(controller.parseCsv(null)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.parseCsv(null)).rejects.toThrow(
        'No file uploaded',
      );
      expect(service.parseCsv).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when file is not a CSV', async () => {
      const nonCsvFile = {
        ...mockFile,
        originalname: 'test.txt',
      };

      await expect(controller.parseCsv(nonCsvFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.parseCsv(nonCsvFile)).rejects.toThrow(
        'File must be a CSV file',
      );
      expect(service.parseCsv).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when CSV parsing fails', async () => {
      mockCsvParserService.parseCsv.mockImplementation(() => {
        throw new BadRequestException('Failed to parse CSV: Invalid delimiter');
      });

      await expect(controller.parseCsv(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.parseCsv).toHaveBeenCalled();
    });
  });
});
