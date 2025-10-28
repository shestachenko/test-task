import {Controller, Post, UseInterceptors, UploadedFile, UseGuards} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {CsvParserService, ParsedRow} from '../services/csv-parser.service';
import {memoryStorage} from 'multer';
import {AuthGuard} from '../../../common/guards/auth.guard';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('csv-parser')
export class CsvParserController {
  constructor(private readonly csvParserService: CsvParserService) {}

  @Post('parse')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async parseCsv(@UploadedFile() file: Express.Multer.File): Promise<BaseResponseDto<ParsedRow[]>> {
    if (!file) {
      return BaseResponseDto.fail<ParsedRow[]>('No file uploaded');
    }

    if (!file.originalname.endsWith('.csv')) {
      return BaseResponseDto.fail<ParsedRow[]>('File must be a CSV file');
    }

    try {
      const parsedData = this.csvParserService.parseCsv(file.buffer);
      return BaseResponseDto.ok<ParsedRow[]>(parsedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse CSV';
      return BaseResponseDto.fail<ParsedRow[]>(errorMessage);
    }
  }
}

