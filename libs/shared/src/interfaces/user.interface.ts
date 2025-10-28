import {IBaseModel} from './base.model.interface';

export interface IUser extends IBaseModel {
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ILoginDto {
  username: string;
  password: string;
}

export interface IRegisterDto {
  user: IUser;
}

export interface IAuthResponseDto {
  user: IUser;
}

