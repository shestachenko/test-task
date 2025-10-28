import {IBaseModel} from './base.model.interface';

export interface IAmenity extends IBaseModel {
  name: string;
}

export interface CreateAmenityDto {
  name: string;
}

export interface UpdateAmenityDto {
  name?: string;
}

