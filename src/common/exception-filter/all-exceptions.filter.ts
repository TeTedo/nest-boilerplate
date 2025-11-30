import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

/**
 * 모든 예외를 처리하는 필터
 * HttpException이 아닌 예상치 못한 예외도 일관된 형식으로 처리합니다.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 오류가 발생했습니다.';
    let error: string | string[] | undefined;

    // HttpException인 경우
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as {
          message?: string | string[];
          error?: string | string[];
        };
        const extractedMessage = responseObj.message || exception.message;
        // 배열인 경우 첫 번째 메시지 사용
        message = Array.isArray(extractedMessage)
          ? extractedMessage[0]
          : extractedMessage;
        error = responseObj.error;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // 일반 Error인 경우
      message = exception.message;
      error = exception.name;
    }

    // 에러 로깅
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // 공통 에러 응답 형식으로 변환
    const errorResponse = new ErrorResponseDto(
      status,
      message,
      request.url,
      error,
    );

    response.status(status).json(errorResponse);
  }
}
