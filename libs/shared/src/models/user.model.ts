export interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
}
