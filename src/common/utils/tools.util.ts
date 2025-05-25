/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility functions.
 * @file Utility Functions
 * @module utils
 * @description Contains various utility functions for hashing, sleeping, JSON parsing, async pooling, and key transformation.
 */

/**
 * Converts a string to camelCase, ensuring it doesn't start with numeric characters.
 * @param key - The key to convert.
 * @returns The camelCase key.
 */
const camelcaseKey = (key: string): string => {
  // Remove leading digits and any leading underscores, dots, hyphens, or spaces
  key = key.replace(/^[0-9_.\- ]+/, '');

  // Convert underscores, dots, hyphens, or spaces to camelCase
  return key.replace(/([_.\- ]+)(\w|$)/g, (_, __, c) => (c ? c.toUpperCase() : ''));
};

/**
 * Recursively converts all keys of an object or array to camelCase.
 * @param obj - The object or array to convert.
 * @returns The object or array with camelCase keys.
 */
export const camelcaseKeys = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(camelcaseKeys);
  }
  const result: any = {};
  Object.keys(obj).forEach((k) => {
    result[camelcaseKey(k)] = camelcaseKeys(obj[k]);
  });
  return result;
};
