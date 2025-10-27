import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {AmenityModel} from '@red/shared';

export type AmenityDocument = HydratedDocument<Amenity>;

@Schema({timestamps: true})
export class Amenity implements Omit<AmenityModel, 'id'> {
  @Prop({required: true})
  name: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);

