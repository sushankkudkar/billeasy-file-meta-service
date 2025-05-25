import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import fastifyCookie from '@fastify/cookie';
import middie from '@fastify/middie';
import multipart from '@fastify/multipart';

import { CustomLoggerService } from '~/processors/logger/logger.service';
import { CorsMiddleware } from '~/common/middlewares/cors.middleware';
import { GlobalConfigMiddleware } from '~/common/middlewares/global-config.middleware';
import { SwaggerMiddleware } from '~/common/middlewares/swagger.middleware';
import { requestIdMiddleware } from '~/common/middlewares/request.id.middleware';

import { AppModule } from './app.module';

declare const module: any;

/**
 * Bootstrap function to initialize and start the NestJS Fastify application.
 */
export async function bootstrap() {
  const adapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
    autoFlushLogs: true,
  });

  // Register middleware support (needed for `.use`)
  if (!(app as any).use) {
    await app.register(middie);
  }

  // Register requestId middleware (now `.use` is available)
  app.use(requestIdMiddleware);

  await app.register(multipart); // 👈 Needed to handle file uploads


  // Get services
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);

  // Attach logger before any custom logs
  app.useLogger(logger);

  // Enable URI-based versioning
  app.enableVersioning({ type: VersioningType.URI });

  // Apply CORS config
  await new CorsMiddleware().configure(app);

  // Apply global settings: global prefix, interceptors, pipes, etc.
  new GlobalConfigMiddleware(configService).configure(app);

  // Setup Swagger docs
  await new SwaggerMiddleware().configure(app);

  // Register Fastify cookie plugin
  await app.register(fastifyCookie, {
    secret: 'my_cookie_secret',
  });

  // Start server
  await startServer(app, configService, logger);

  // Enable HMR
  setupHotModuleReplacement(app);
}

/**
 * Start the Fastify server.
 */
async function startServer(app: NestFastifyApplication, configService: ConfigService, logger: CustomLoggerService) {
  const port = configService.get<string>('app.port') || '3333';
  const env = configService.get<string>('app.env') || 'development';

  try {
    await app.listen(port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`[PID:${process.pid}] Server listening on: ${url}; NODE_ENV: ${env}`);
  } catch (err) {
    logger.error(`Error starting server: ${err}`);
    process.exit(1); // Optionally exit if server fails
  }
}

/**
 * Setup Hot Module Replacement for development.
 */
function setupHotModuleReplacement(app: NestFastifyApplication) {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
