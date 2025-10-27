import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Amenity, AmenityDocument} from '../schemas/amenity.schema';

@Injectable()
export class AmenityRepository {
  constructor(
    @InjectModel(Amenity.name) private amenityModel: Model<AmenityDocument>
  ) {}

  async findById(id: string): Promise<AmenityDocument | null> {
    return this.amenityModel.findById(id).exec();
  }
}

