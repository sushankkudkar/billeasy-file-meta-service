/**
 * Application entry point.
 * @file Application Entry Point
 * @module main
 * @description This file initializes and starts the NestJS application.
 */

import { bootstrap } from './bootstrap';

async function main() {
  try {
    await bootstrap();
  } catch (error) {
    console.error('Error during application bootstrap:', error);
  }
}
main();
