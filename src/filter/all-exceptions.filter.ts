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

    switch (true) {
      case exception instanceof BadRequestException:
        message = 'Bad Request';
        break;
      case exception instanceof UnauthorizedException:
        message = 'Unauthorized';
        break;
      case exception instanceof NotFoundException:
        message = 'Not Found';
        break;
      case exception instanceof ForbiddenException:
        message = 'Forbidden';
        break;
      case exception instanceof NotAcceptableException:
        message = 'Not Acceptable';
        break;
      case exception instanceof RequestTimeoutException:
        message = 'Request Timeout';
        break;
      case exception instanceof ConflictException:
        message = 'Conflict';
        break;
      case exception instanceof GoneException:
        message = 'Gone';
        break;
      case exception instanceof HttpVersionNotSupportedException:
        message = 'HTTP Version Not Supported';
        break;
      case exception instanceof PayloadTooLargeException:
        message = 'Payload Too Large';
        break;
      case exception instanceof UnsupportedMediaTypeException:
        message = 'Unsupported Media Type';
        break;
      case exception instanceof UnprocessableEntityException:
        message = 'Unprocessable Entity';
        break;
      case exception instanceof InternalServerErrorException:
        message = 'Internal Server Error';
        break;
      case exception instanceof NotImplementedException:
        message = 'Not Implemented';
        break;
      case exception instanceof ImATeapotException:
        message = "I'm a teapot";
        break;
      case exception instanceof MethodNotAllowedException:
        message = 'Method Not Allowed';
        break;
      case exception instanceof BadGatewayException:
        message = 'Bad Gateway';
        break;
      case exception instanceof ServiceUnavailableException:
        message = 'Service Unavailable';
        break;
      case exception instanceof GatewayTimeoutException:
        message = 'Gateway Timeout';
        break;
      case exception instanceof PreconditionFailedException:
        message = 'Precondition Failed';
        break;
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: message,
      errors: errors,
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
