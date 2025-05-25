/**
 * CORS Middleware.
 * @file Middleware for configuring Cross-Origin Resource Sharing (CORS) settings.
 * @module middleware/cors
 * @description Middleware to set up and manage CORS policies in a NestJS + Fastify application.
 */

import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';

/**
 * @class CorsMiddleware
 * @description Middleware class to configure Cross-Origin Resource Sharing (CORS) settings for the Fastify application.
 * @example
 * const corsMiddleware = new CorsMiddleware();
 * await corsMiddleware.configure(app);
 */
@Injectable()
export class CorsMiddleware {
  /**
   * Configure CORS settings for the Fastify application.
   * @param {NestFastifyApplication} app - The NestJS Fastify application instance.
   */
  async configure(app: NestFastifyApplication) {
    // List of origins allowed to access the application. '*' means all origins are allowed.
    const allowedOrigins = ['*'];

    // Convert allowed origins (except '*') into regular expressions
    const allowedHosts = allowedOrigins.filter((origin) => origin !== '*').map((origin) => new RegExp(origin, 'i'));

    await app.register(cors, {
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes('*')) {
          cb(null, true);
        } else {
          const isAllowed = allowedHosts.some((host) => host.test(origin));
          cb(null, isAllowed);
        }
      },
      credentials: true,
    });
  }
}
