import { BaseError, useErrors } from "@lib/hooks/use-errors"

/**
 * Errors that can occur in the product comparison system.
 * Used to categorize errors for appropriate handling and user feedback.
 */
export enum CompareErrorType {
  /**
   * Errors related to loading or accessing product data.
   * Occurs when products cannot be retrieved from the API,
   * or when required product data is missing.
   */
  LOADING_ERROR = "COMPARED_PRODUCTS_LOADING_ERROR",

  /**
   * Storage related errors with browser's localStorage.
   * Can occur during reading, writing, or parsing stored comparison data,
   * or when synchronized between different browser tabs.
   */
  STORAGE_ERROR = "COMPARED_PRODUCTS_STORAGE_ERROR",

  /**
   * Errors that occur when refreshing product data fails.
   * Can occur during scheduled or manual refreshes attempts,
   * when updated product information cannot be retrieved.
   */
  REFRESH_ERROR = "COMPARED_PRODUCTS_REFRESH_ERROR",

  /**
   * Error indicating the maximum number of products for comparison has been reached.
   * Occurs when a user attempts to add more products than the system allows,
   * (limited to MAX_COMPARED_PRODUCTS).
   */
  PRODUCT_LIMIT_REACHED = "COMPARED_PRODUCTS_LIMIT_REACHED",
}

/**
 * Type definition for a Compare-specific error object.
 */
export type CompareError = BaseError<CompareErrorType>

/**
 * Hook for managing Compare-specific errors
 * @returns Object containing error state and error handling functions
 */
export function useCompareErrors() {
  return useErrors<CompareErrorType>("Comparison")
}
