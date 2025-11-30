/**
 * 공통 API 응답 인터페이스
 */
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

/**
 * 성공 응답 DTO
 */
export class SuccessResponseDto<T = any> implements ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;

  constructor(statusCode: number, message: string, data?: T, path?: string) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }
}

/**
 * 에러 응답 DTO
 */
export class ErrorResponseDto implements ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  error?: string | string[];

  constructor(
    statusCode: number,
    message: string,
    path?: string,
    error?: string | string[],
  ) {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
    this.error = error;
  }
}
