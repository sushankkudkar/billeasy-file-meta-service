/**
 * Application Configuration Module.
 * @file Application configuration module
 * @module config/app-config.module
 * @description Configures the NestJS application to use environment variables and configuration files.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configuration';

/**
 * AppConfigModule
 * @description Registers the configuration module with NestJS, loading environment variables and configuration settings.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Makes the configuration globally available
      envFilePath: '.env', // Path to the environment file
    }),
  ],
})
export class AppConfigModule {}
