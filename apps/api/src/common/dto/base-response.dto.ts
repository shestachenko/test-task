export class BaseResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;

  constructor(success: boolean, data?: T, message?: string, error?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static ok<T>(data: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto(true, data, message);
  }

  static fail<T>(error: string): BaseResponseDto<T> {
    return new BaseResponseDto(false, undefined, undefined, error);
  }
}
