/**
 * @file Prisma Provider
 * @module providers/prisma-provider
 * @description Provides a PrismaClient instance configured for use with Prisma ORM.
 * This class extends PrismaClient and sets up custom logging for connection events.
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLoggerService } from '~/processors/logger/logger.service';

const Badge = `['PostgresDB']`;

/**
 * @class PrismaProvider
 * @description Extends PrismaClient to include custom logging for database connection events.
 * This provider initializes PrismaClient and configures logging for connection success and errors.
 * @extends PrismaClient
 * @example
 * // Usage in a NestJS application:
 * const prismaProvider = new PrismaProvider();
 * // Now prismaProvider can be used to interact with the SQL database with custom logging.
 */
@Injectable()
export class PrismaProvider extends PrismaClient {
  /**
   * @property {CustomLoggerService} logger - The custom logger service for logging database connection events.
   * @description An instance of CustomLoggerService is used to log connection success and errors.
   */
  private readonly logger = new CustomLoggerService();

  /**
   * Constructs a new PrismaProvider instance.
   * @description Initializes PrismaClient and sets up custom logging for connection events.
   * The logger is configured to use the context of the current class.
   */
  constructor() {
    super();
    this.logger.setContext(PrismaProvider.name);
    this.setupLogging();
  }

  /**
   * Sets up logging for PrismaClient connection events.
   * @description Logs a message when the connection attempt starts, succeeds, or fails.
   * Uses the CustomLoggerService to log the connection status.
   */
  private setupLogging() {
    this.logger.log(Badge, 'connecting...'); // Log connection attempt start
    this.$connect()
      .then(() => {
        this.logger.log(Badge, 'connected successfully!'); // Log successful connection
      })
      .catch((error) => {
        this.logger.error(Badge, 'connection error:', error); // Log connection error
      });
  }
}
