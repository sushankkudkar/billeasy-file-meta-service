/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IP utility functions.
 * @file IP Utility Functions
 * @module utils/ip
 * @description Provides functions for extracting IP addresses and parsing relative URLs.
 */

import type { FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'node:http';

/**
 * Retrieves the IP address from a request object.
 * @param request - The request object, which can be a `FastifyRequest` or `IncomingMessage`.
 * @returns The IP address as a string, or `undefined` if not found.
 */
export const getIp = (
    request: FastifyRequest | IncomingMessage,
): string | undefined => {
    const req = request as any;

    let ip: string | undefined =
        req.headers['x-forwarded-for'] ||
        req.ip ||
        req.raw?.connection?.remoteAddress ||
        req.raw?.socket?.remoteAddress;

    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0];
    }
    return ip;
};

/**
 * Parses a relative URL and converts it to an absolute URL.
 * @param path - The relative URL path.
 * @returns An absolute URL object.
 */
export const parseRelativeUrl = (path: string): URL => {
    if (!path || !path.startsWith('/')) {
        return new URL('http://a.com');
    }
    return new URL(`http://a.com${path}`);
};
