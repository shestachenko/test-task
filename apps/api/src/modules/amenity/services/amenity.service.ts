import {Injectable} from '@nestjs/common';
import {AmenityRepository} from '../repositories/amenity.repository';

@Injectable()
export class AmenityService {
  constructor(private readonly amenityRepository: AmenityRepository) {}

  async findById(id: string) {
    return this.amenityRepository.findById(id);
  }
}

