import {Injectable} from '@nestjs/common';
import {parse} from 'csv-parse/sync';

export interface ParsedRow {
  [key: string]: string | number;
}

@Injectable()
export class CsvParserService {
  parseCsv(buffer: Buffer): ParsedRow[] {
    const csvContent = buffer.toString('utf-8');
    
    // Parse the CSV content
    return parse(csvContent, {
      columns: true, // Use first row as headers
      skip_empty_lines: true,
      delimiter: ';', // Both example CSV files use semicolon as delimiter
      bom: true, // Handle BOM if present
    });
  }
}
