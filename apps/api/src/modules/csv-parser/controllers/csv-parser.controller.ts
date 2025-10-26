import {Controller, Post, UseInterceptors, UploadedFile, BadRequestException} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {CsvParserService} from '../services/csv-parser.service';
import {memoryStorage} from 'multer';

@Controller('csv-parser')
export class CsvParserController {
  constructor(private readonly csvParserService: CsvParserService) {}

  @Post('parse')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async parseCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV file');
    }

    return this.csvParserService.parseCsv(file.buffer);
  }
}

