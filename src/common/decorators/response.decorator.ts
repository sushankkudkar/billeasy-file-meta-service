/**
 * Response Metadata Decorator.
 * @file Decorator for setting response metadata on controller methods.
 * @module decorator/response-metadata
 * @description This module provides a decorator to set response metadata for individual API methods, allowing for custom status, success, message, and error handling.
 */

import { SetMetadata } from '@nestjs/common';
import { RESPONSE_METADATA_KEY } from '../constants/meta.constants';

/**
 * Interface for Response Metadata.
 * @interface
 * @description Defines the structure for response metadata used in the decorator.
 * @property {number} [status] - The HTTP status code to be returned in the response.
 * @property {boolean} [success] - Indicates whether the response signifies a successful operation.
 * @property {string} [message] - A message to be included in the response, such as a description or additional information.
 * @property {string | null} [error] - An error message, if any, to be included in the response. Can be `null` if no error is present.
 */
export interface ResponseMetaOptions {
  success?: boolean;
  code?: number;
  message?: string;
  error?: string | null;
  data?: object;
}

/**
 * Enhanced decorator to accept individual API metadata.
 * @function
 * @param {string} moduleName - The name of the module to which the API method belongs.
 * @param {string} methodName - The name of the API method for which metadata is being set.
 * @returns {CustomDecorator} - The metadata decorator function that sets the specified metadata.
 * @description This decorator allows attaching custom metadata to API methods to handle response status, success status, messages, and errors.
 * The metadata is stored using the specified `RESPONSE_METADATA_KEY` and can be accessed later to format responses accordingly.
 */
export const ResponseMeta = (metadata: ResponseMetaOptions) => {
  return SetMetadata(RESPONSE_METADATA_KEY, metadata);
};
