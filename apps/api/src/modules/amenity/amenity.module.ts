import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AmenityService} from './services/amenity.service';
import {AmenityRepository} from './repositories/amenity.repository';
import {Amenity, AmenitySchema} from './schemas/amenity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Amenity.name, schema: AmenitySchema}]),
  ],
  controllers: [],
  providers: [AmenityService, AmenityRepository],
  exports: [AmenityService],
})
export class AmenityModule {}

