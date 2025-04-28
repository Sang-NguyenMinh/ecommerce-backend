import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errors = [exceptionResponse];
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        message =
          exceptionResponse.message || exceptionResponse.error || message;
        errors = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message || message];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [exception.message];
    }

    // Map các ngoại lệ đến thông báo mặc định
    const defaultMessages = new Map<Function, string>([
      [BadRequestException, 'Bad Request'],
      [UnauthorizedException, 'Unauthorized'],
      [NotFoundException, 'Not Found'],
      [ForbiddenException, 'Forbidden'],
      [NotAcceptableException, 'Not Acceptable'],
      [RequestTimeoutException, 'Request Timeout'],
      [ConflictException, 'Conflict'],
      [GoneException, 'Gone'],
      [HttpVersionNotSupportedException, 'HTTP Version Not Supported'],
      [PayloadTooLargeException, 'Payload Too Large'],
      [UnsupportedMediaTypeException, 'Unsupported Media Type'],
      [UnprocessableEntityException, 'Unprocessable Entity'],
      [InternalServerErrorException, 'Internal Server Error'],
      [NotImplementedException, 'Not Implemented'],
      [ImATeapotException, "I'm a teapot"],
      [MethodNotAllowedException, 'Method Not Allowed'],
      [BadGatewayException, 'Bad Gateway'],
      [ServiceUnavailableException, 'Service Unavailable'],
      [GatewayTimeoutException, 'Gateway Timeout'],
      [PreconditionFailedException, 'Precondition Failed'],
    ]);

    for (const [exceptionType, defaultMsg] of defaultMessages.entries()) {
      if (exception instanceof exceptionType && !message) {
        message = defaultMsg;
        break;
      }
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message,
      errors,
    };

    httpAdapter.reply(response, responseBody, status);
  }
}

//Sử dụng cho một số controller thì @UseFilters(AllExceptionsFilter)   tất cả thì  app.useGlobalFilters(new AllExceptionsFilter()); trong main.ts
// return
// statusCode: Mã trạng thái HTTP
// timestamp: Thời điểm xảy ra lỗi
// path: Đường dẫn URL gây ra lỗi
// message: Thông báo lỗi chung
// errors: Mảng các thông báo lỗi chi tiết (nếu có)
