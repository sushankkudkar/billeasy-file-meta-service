/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * JSON Transformer Interceptor.
 * @file Interceptor for transforming response bodies into JSON standard format.
 * @module interceptor/json-transformer
 * @description Converts response bodies to use snake_case keys and serializes objects.
 * @example The interceptor transforms response data to ensure consistent formatting and key naming conventions.
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { isArrayLike, isObjectLike } from 'lodash';
import { Observable, map } from 'rxjs';

import { camelcaseKeys } from '../utils/tools.util';
import { RESPONSE_PASSTHROUGH_METADATA } from '~/common/constants/system.constant';

/**
 * Interceptor that transforms response bodies into a JSON standard format.
 * @class JSONTransformerInterceptor
 * @description This interceptor converts response bodies to use snake_case keys and serializes objects.
 */
@Injectable()
export class JSONTransformerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepts the response and transforms it into the JSON standard format.
   * @method intercept
   * @param {ExecutionContext} context - The execution context for the request.
   * @param {CallHandler} next - The call handler for processing the request.
   * @returns {Observable<any>} An observable containing the transformed response data.
   * @description Checks for metadata to determine if transformation should be bypassed, then applies transformation to the response data.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();

    // Skip requests that are marked to bypass transformation
    const bypass = this.reflector.get<boolean>(RESPONSE_PASSTHROUGH_METADATA, handler);
    if (bypass) {
      return next.handle();
    }

    const http = context.switchToHttp();
    if (!http.getRequest()) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => this.serialize(data)));
  }

  /**
   * Serializes an object, converting keys to snake_case and removing internal properties.
   * @method serialize
   * @param {any} obj - The object to serialize.
   * @returns {any} The serialized object with snake_case keys and without PostgresDB internal properties.
   * @description Recursively converts keys of objects to snake_case, handles arrays, and removes internal PostgresDB properties.
   */
  private serialize(obj: any): any {
    if (!isObjectLike(obj)) {
      return obj;
    }

    if (isArrayLike(obj)) {
      return Array.from(obj).map((item) => this.serialize(item));
    } else {
      // If the object has toJSON or toObject methods, call them
      if (obj.toJSON || obj.toObject) {
        obj = obj.toJSON?.() ?? obj.toObject?.();
      }

      // Remove PostgresDB internal version key
      Reflect.deleteProperty(obj, '__v');

      // Serialize object properties
      for (const key of Object.keys(obj)) {
        const val = obj[key];

        if (isObjectLike(val)) {
          if (val.toJSON) {
            obj[key] = val.toJSON();
            if (!isObjectLike(obj[key])) {
              continue;
            }
            Reflect.deleteProperty(obj[key], '__v');
          }
          obj[key] = this.serialize(obj[key]);
        }
      }

      // Convert keys to snake_case
      obj = camelcaseKeys(obj);
    }

    return obj;
  }
}
