/**
 * Swagger Middleware.
 * @file Middleware for configuring Swagger documentation.
 * @module middleware/swagger
 * @description Sets up and configures Swagger API documentation in a NestJS application using Fastify.
 */

import { Injectable } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

/**
 * @class SwaggerMiddleware
 * @description Middleware for configuring and setting up Swagger API documentation in a NestJS + Fastify application.
 * @example
 * const swaggerMiddleware = new SwaggerMiddleware();
 * await swaggerMiddleware.configure(app);
 */
@Injectable()
export class SwaggerMiddleware {
  /**
   * Configures Swagger for API documentation.
   * @param {NestFastifyApplication} app - The NestJS Fastify application instance.
   * @description Sets up Swagger using the provided application instance and configuration settings.
   */
  async configure(app: NestFastifyApplication) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description')
      .setVersion('1.0')
      .addTag('Nest HTTP API Documentation')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
  }
}
