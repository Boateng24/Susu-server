import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';

interface ErrorResponse {
  message: string;
  code?: string;
}

@Catch(PrismaClientKnownRequestError, HttpException, Error)
export class ErrorFilter implements ExceptionFilter {
  catch(
    exception: PrismaClientKnownRequestError | HttpException | Error,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      message: 'An unexpected error occurred',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseContent = exception.getResponse();
      errorResponse =
        typeof responseContent === 'string'
          ? { message: responseContent }
          : (responseContent as ErrorResponse);
    } else if (exception instanceof PrismaClientKnownRequestError) {
      status = this.getStatusCode(exception.code);
      errorResponse = {
        message: exception.message,
        code: exception.code,
      };
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
    });
  }

  getStatusCode(code: string): HttpStatus {
    // Add specific status codes based on Prisma error codes if needed
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT; // Unique constraint
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
