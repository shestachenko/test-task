import {Test, TestingModule} from '@nestjs/testing';
import {CsvParserService} from './csv-parser.service';

describe('CsvParserService', () => {
  let service: CsvParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvParserService],
    }).compile();

    service = module.get<CsvParserService>(CsvParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseCsv', () => {
    it('should parse valid CSV content with semicolon delimiter', () => {
      const csvContent = 'name;age;city\nJohn;30;New York\nJane;25;Boston';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([
        {name: 'John', age: '30', city: 'New York'},
        {name: 'Jane', age: '25', city: 'Boston'},
      ]);
    });

    it('should parse CSV with BOM (Byte Order Mark)', () => {
      const csvContent = '\uFEFFname;age\nJohn;30';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([
        {name: 'John', age: '30'},
      ]);
    });

    it('should skip empty lines', () => {
      const csvContent = 'name;age\nJohn;30\n\nJane;25';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([
        {name: 'John', age: '30'},
        {name: 'Jane', age: '25'},
      ]);
    });

    it('should handle single row CSV', () => {
      const csvContent = 'col1;col2;col3\nvalue1;value2;value3';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([
        {col1: 'value1', col2: 'value2', col3: 'value3'},
      ]);
    });

    it('should throw CsvError on invalid CSV with unclosed quotes', () => {
      const invalidBuffer = Buffer.from('name;description\nJohn;"unclosed quote', 'utf-8');

      expect(() => service.parseCsv(invalidBuffer)).toThrow();
    });

    it('should handle empty CSV', () => {
      const buffer = Buffer.from('', 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([]);
    });

    it('should handle CSV with only headers', () => {
      const csvContent = 'name;age';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([]);
    });

    it('should parse CSV with special characters', () => {
      const csvContent = 'name;description\nTom;It\'s good\nMary;Test & more';
      const buffer = Buffer.from(csvContent, 'utf-8');

      const result = service.parseCsv(buffer);

      expect(result).toEqual([
        {name: 'Tom', description: 'It\'s good'},
        {name: 'Mary', description: 'Test & more'},
      ]);
    });
  });
});

