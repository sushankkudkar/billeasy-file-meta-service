/**
 * Application Controller.
 * @file App Controller
 * @module controller/app
 * @description This controller handles basic application routes, including a health check endpoint.
 */

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * @class AppController
 * @description Controller for handling basic application routes such as health checks.
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   */
  constructor() {}

  /**
   * Handles the '/health-check' route to check the health of the application.
   * @route GET /health-check
   * @returns {string} A simple 'working' message indicating that the application is up and running.
   * @example
   * // Example GET request
   * GET /health-check
   * // Example response
   * 'working'
   */
  @Get('health-check')
  @ApiOperation({ summary: 'Check the health of the application' })
  @ApiResponse({ status: 200, description: 'Returns a simple working message' })
  healthCheck(): string {
    return 'working';
  }
}
