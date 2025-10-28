import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {IAmenity} from '@red/shared';

export type AmenityDocument = HydratedDocument<Amenity>;

@Schema({timestamps: true})
export class Amenity implements IAmenity {
  @Prop({required: true})
  name: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);

