/**
 * Constants for NestJS and application-specific configuration.
 * @file Defines constants used throughout the application.
 * @module constants
 */

// Token for HttpAdapterHost in NestJS
export const HTTP_ADAPTER_HOST = 'HttpAdapterHost';

// Token for Reflector in NestJS
export const REFLECTOR = 'Reflector';

// Metadata key for response passthrough configuration
export const RESPONSE_PASSTHROUGH_METADATA = '__responsePassthrough__';

// Token for database connection
export const DB_CONNECTION_TOKEN = '__db_connection_token__';

// Suffix used for database model tokens
export const DB_MODEL_TOKEN_SUFFIX = '__db_model_token_suffix__';
