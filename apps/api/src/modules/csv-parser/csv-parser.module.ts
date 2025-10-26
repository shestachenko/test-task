import {Module} from '@nestjs/common';
import {CsvParserController} from './controllers/csv-parser.controller';
import {CsvParserService} from './services/csv-parser.service';

@Module({
  controllers: [CsvParserController],
  providers: [CsvParserService],
})
export class CsvParserModule {}

