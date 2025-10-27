import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserMethods {
  validatePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<User & UserMethods>;

@Schema({timestamps: true})
export class User {
  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  first_name: string;

  @Prop({required: true})
  last_name: string;

  @Prop({required: true})
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add instance method for password validation
UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

