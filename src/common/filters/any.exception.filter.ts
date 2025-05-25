/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';

import { HTTP_REQUEST_TIME } from '../constants/meta.constants';
import { REFLECTOR } from '../constants/system.constant';

import { getIp } from '../utils/ip.util';
import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor';
import { CustomLoggerService } from '~/processors/logger/logger.service';
import { ApiResponse } from '~/common/types/api.response.type';

/**
 * Global Exception Filter for handling and logging errors.
 * @class AllExceptionsFilter
 * @implements {ExceptionFilter}
 * @description Catches all exceptions, logs details, and ensures a consistent response format.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new CustomLoggerService();

    constructor(@Inject(REFLECTOR) private readonly reflector: Reflector) {
        this.logger.setContext(AllExceptionsFilter.name);
    }

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        // Handle preflight OPTIONS requests
        if (request.method === 'OPTIONS') {
            return response.status(HttpStatus.OK).send();
        }

        // Determine the HTTP status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : (exception as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;

        // Extract message and error details
        const exceptionResponse =
            exception instanceof HttpException
                ? (exception.getResponse() as any)
                : exception;

        const message =
            exceptionResponse?.message ||
            (exception as any)?.message ||
            'An unexpected error occurred';

        const errorDetails =
            exceptionResponse?.error || (exception as any)?.error || null;

        // Log the error details
        this.logError(request, status, message);

        // Standardized API error response
        const errorResponse: ApiResponse<null> = {
            success: false,
            code: status,
            message,
            error: errorDetails,
            data: null, // Always enforce a `data` field, even in errors
        };

        response.status(status).type('application/json').send(errorResponse);
    }

    /**
     * Logs the error details for debugging and monitoring.
     * @param {FastifyRequest} request - The request object.
     * @param {number} status - HTTP status code.
     * @param {string} message - Error message.
     */
    private logError(
        request: FastifyRequest,
        status: number,
        message: string,
    ): void {
        const url = request.raw.url!;
        const ip = getIp(request);

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`Internal Server Error: ${message}`);
        } else {
            this.logger.warn(
                `IP: ${ip}, Status: ${status}, Message: ${message}, Path: ${decodeURI(url)}`,
            );
        }

        // Log request duration if available
        const prevRequestTs = this.reflector.get(HTTP_REQUEST_TIME, request as any);
        if (prevRequestTs) {
            const content = `${request.method} -> ${request.url}`;
            this.logger.debug(
                `--- ResponseError: ${content} +${Date.now() - prevRequestTs}ms`,
                LoggingInterceptor.name,
            );
        }
    }
}
