import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly context = 'REQUEST';

  constructor(private logger: Logger) { }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    this.logger.log(`<< Error response: ${JSON.stringify(exception.getResponse())}`);
    response
      .status(status)
      .json(exception.getResponse());
  }
}