import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { SuccessResponseDto } from '../dto/response.dto';
import { API_RESPONSE_MESSAGE_KEY } from '../decorator/api-response.decorator';

/**
 * 성공 응답을 일관된 형식으로 변환하는 인터셉터
 * 컨트롤러에서 반환하는 데이터를 공통 응답 형식으로 래핑합니다.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;

    // 데코레이터로 설정된 커스텀 메시지 가져오기
    const customMessage = this.reflector.get<string>(
      API_RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // 이미 SuccessResponseDto 형식이면 그대로 반환
        if (
          data &&
          typeof data === 'object' &&
          data instanceof SuccessResponseDto &&
          data.success === true
        ) {
          return data;
        }

        // 기본 성공 응답 형식으로 변환
        const statusCode =
          context.switchToHttp().getResponse<Response>().statusCode || 200;
        const message = customMessage || this.getDefaultMessage(request.method);

        return new SuccessResponseDto(statusCode, message, data, path);
      }),
    );
  }

  /**
   * HTTP 메서드에 따른 기본 메시지 반환
   */
  private getDefaultMessage(method: string): string {
    const messageMap: Record<string, string> = {
      GET: '요청이 성공적으로 처리되었습니다.',
      POST: '리소스가 성공적으로 생성되었습니다.',
      PUT: '리소스가 성공적으로 수정되었습니다.',
      PATCH: '리소스가 성공적으로 수정되었습니다.',
      DELETE: '리소스가 성공적으로 삭제되었습니다.',
    };

    return messageMap[method] || '요청이 성공적으로 처리되었습니다.';
  }
}
