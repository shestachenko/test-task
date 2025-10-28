import {IBaseModel} from './base.model.interface';

export interface IUser extends IBaseModel {
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  user: IUser;
}

export interface AuthResponseDto {
  user: IUser;
}

