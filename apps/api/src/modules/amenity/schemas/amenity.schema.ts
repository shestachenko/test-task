import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {AmenityModel} from '@red/shared';

export type AmenityDocument = Amenity & Document;

@Schema({timestamps: true})
export class Amenity implements Omit<AmenityModel, 'id'> {
  @Prop({required: true, unique: true})
  numericId: number;

  @Prop({required: true})
  name: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);

