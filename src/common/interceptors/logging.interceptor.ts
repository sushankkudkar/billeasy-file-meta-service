/**
 * Logging Interceptor.
 * @file Interceptor for logging request and response details.
 * @module interceptor/logging
 * @description Logs request and response details in development mode.
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { CustomLoggerService } from '~/processors/logger/logger.service';

import { ConfigService } from '@nestjs/config';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HTTP_REQUEST_TIME } from '~/common/constants/meta.constants';

/**
 * Logging Interceptor for NestJS.
 * @class LoggingInterceptor
 * @description Intercepts HTTP requests and responses to log details such as request method, URL, and response time.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new CustomLoggerService();

  /**
   * Constructs a new LoggingInterceptor instance.
   * @param {ConfigService} configService - The ConfigService instance for accessing environment configurations.
   */
  constructor(private readonly configService: ConfigService) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  /**
   * Intercepts the HTTP request and response to log details.
   * @param {ExecutionContext} context - The context of the current request.
   * @param {CallHandler} next - The next handler in the request pipeline.
   * @returns {Observable<any>} The observable of the response.
   * @description Logs request method and URL, and measures response time. Only logs if the environment is 'development'.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Only log requests and responses in development mode
    if (!(this.configService.get('app.env') === 'development')) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    if (!request) {
      return next.handle();
    }

    const { method, url } = request;
    const now = Date.now();
    const logContent = `${method} -> ${url}`;

    this.logger.debug(`+++ Request: ${logContent}`);
    Reflect.defineMetadata(HTTP_REQUEST_TIME, now, request);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.debug(`--- Response: ${logContent} +${duration}ms`);
      }),
    );
  }
}
