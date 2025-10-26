export interface AmenityModel {
  id?: string;
  name: string;
}

export interface CreateAmenityDto {
  name: string;
}

export interface UpdateAmenityDto {
  name?: string;
}
