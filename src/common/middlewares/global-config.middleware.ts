/**
 * Global Configuration Middleware.
 * @file Middleware for setting up global configurations.
 * @module middleware/global-config
 * @description Configures global settings such as route prefixes, interceptors, and validation pipes in a NestJS + Fastify application.
 */

import { Injectable } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor';

/**
 * @class GlobalConfigMiddleware
 * @description Middleware for setting up global configurations such as route prefixes, interceptors, and validation pipes in a NestJS + Fastify application.
 * @example
 * const globalConfigMiddleware = new GlobalConfigMiddleware(configService);
 * globalConfigMiddleware.configure(app);
 */
@Injectable()
export class GlobalConfigMiddleware {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Configures global application settings.
   * @param {NestFastifyApplication} app - The NestJS Fastify application instance.
   */
  configure(app: NestFastifyApplication) {
    // Set a global route prefix (e.g., `/billeasy`)
    app.setGlobalPrefix('/api/billeasy');

    // Apply a global logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor(this.configService));

    // Apply a global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: 422,
        forbidUnknownValues: true,
        enableDebugMessages: true,
        stopAtFirstError: true,
      }),
    );
  }
}
