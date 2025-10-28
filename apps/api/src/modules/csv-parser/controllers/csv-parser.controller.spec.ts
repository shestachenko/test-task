import {Test, TestingModule} from '@nestjs/testing';
import {CsvParserController} from './csv-parser.controller';
import {CsvParserService} from '../services/csv-parser.service';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

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
      expect(result).toEqual(BaseResponseDto.ok(mockParsedData));
    });

    it('should return fail response when no file is uploaded', async () => {
      const result = await controller.parseCsv(null);

      expect(result).toEqual(BaseResponseDto.fail('No file uploaded'));
      expect(service.parseCsv).not.toHaveBeenCalled();
    });

    it('should return fail response when file is not a CSV', async () => {
      const nonCsvFile = {
        ...mockFile,
        originalname: 'test.txt',
      };

      const result = await controller.parseCsv(nonCsvFile);

      expect(result).toEqual(BaseResponseDto.fail('File must be a CSV file'));
      expect(service.parseCsv).not.toHaveBeenCalled();
    });

    it('should return fail response when CSV parsing fails', async () => {
      mockCsvParserService.parseCsv.mockImplementation(() => {
        throw new Error('Invalid delimiter');
      });

      const result = await controller.parseCsv(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid delimiter');
      expect(service.parseCsv).toHaveBeenCalled();
    });
  });
});
