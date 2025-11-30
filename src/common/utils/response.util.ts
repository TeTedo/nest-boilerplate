import { SuccessResponseDto, ErrorResponseDto } from '../dto/response.dto';

/**
 * 성공 응답을 생성하는 헬퍼 함수
 *
 * @example
 * ```typescript
 * return createSuccessResponse(200, '회원가입이 완료되었습니다.', userData, request.url);
 * ```
 */
export function createSuccessResponse<T>(
  statusCode: number,
  message: string,
  data?: T,
  path?: string,
): SuccessResponseDto<T> {
  return new SuccessResponseDto(statusCode, message, data, path);
}

/**
 * 에러 응답을 생성하는 헬퍼 함수
 *
 * @example
 * ```typescript
 * return createErrorResponse(400, '잘못된 요청입니다.', request.url, 'ValidationError');
 * ```
 */
export function createErrorResponse(
  statusCode: number,
  message: string,
  path?: string,
  error?: string | string[],
): ErrorResponseDto {
  return new ErrorResponseDto(statusCode, message, path, error);
}
