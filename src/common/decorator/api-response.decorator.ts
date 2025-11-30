import { SetMetadata } from '@nestjs/common';

/**
 * API 응답 메타데이터 키
 */
export const API_RESPONSE_MESSAGE_KEY = 'api_response_message';

/**
 * 컨트롤러 메서드에 커스텀 응답 메시지를 설정하는 데코레이터
 *
 * @example
 * ```typescript
 * @Get()
 * @ApiResponseMessage('회원 정보를 성공적으로 조회했습니다.')
 * async getMember() {
 *   return this.memberService.getMember();
 * }
 * ```
 */
export const ApiResponseMessage = (message: string) =>
  SetMetadata(API_RESPONSE_MESSAGE_KEY, message);
