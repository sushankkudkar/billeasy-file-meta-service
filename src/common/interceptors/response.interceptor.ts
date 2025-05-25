import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ResponseMetaOptions } from '../decorators/response.decorator';
import { RESPONSE_METADATA_KEY } from '../constants/meta.constants'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const handler = context.getHandler();
    const metadata: ResponseMetaOptions = this.reflector.get(RESPONSE_METADATA_KEY, handler) || {};

    return next.handle().pipe(
      map((responseData: any) => {
        // If controller already returned full response, do not re-wrap
        if (
          responseData &&
          typeof responseData === 'object' &&
          'success' in responseData &&
          'code' in responseData &&
          'message' in responseData &&
          'data' in responseData &&
          'error' in responseData
        ) {
          return responseData;
        }

        // Else wrap response and override with metadata if exists
        const response = context.switchToHttp().getResponse();
        // Use metadata.code if set, else response statusCode or default 200
        const statusCode = metadata.code ?? response?.statusCode ?? 200;

        // Optionally set HTTP status code on response
        response.statusCode = statusCode;

        return {
          success: metadata.success ?? true,
          code: statusCode,
          message: metadata.message ?? 'Request successful',
          error: metadata.error ?? null,
          data: this.formatData(responseData),
        };
      }),
    );
  }

  private formatData(data: any): any {
    if (data == null) return {};

    if ('data' in data && typeof data.data === 'object') return data.data;

    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return { value: data };
    }

    if (Array.isArray(data)) {
      return data.length === 0 ? {} : { items: data };
    }

    if (typeof data === 'object') return data;

    return { value: data };
  }
}
