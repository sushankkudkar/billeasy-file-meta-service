/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Interface for standardized API response format.
 * @template T - The type of data being returned in the response.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  error: string | null;
  data: T | null;
}
