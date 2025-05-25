/**
 * @file Postgres Provider
 * @module providers/postgres-provider
 * @description Provides a PrismaClient instance configured for use with PostgreSQL database.
 * This class extends PrismaClient and sets up the connection using the PostgreSQL URL from environment variables.
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * @class PostgresProvider
 * @description Extends PrismaClient to configure and provide a PrismaClient instance for PostgreSQL.
 * This provider initializes PrismaClient with a PostgreSQL connection URL from environment variables.
 * @extends PrismaClient
 * @example
 * // Usage in a NestJS application:
 * const postgresProvider = new PostgresProvider();
 * // Now postgresProvider can be used to interact with the PostgreSQL database.
 */
@Injectable()
export class PostgresProvider extends PrismaClient {
  /**
   * Constructs a new PostgresProvider instance.
   * @description Initializes PrismaClient with the PostgreSQL connection URL from environment variables.
   * Configures the database connection using the URL provided in the `DATABASE_URL` environment variable.
   */
  constructor() {
    super({ datasources: { db: { url: process.env.DATABASE_URL } } });
  }
}
