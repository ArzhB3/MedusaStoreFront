import { useState, useCallback } from "react"
import { toast, type ToasterPosition } from "@medusajs/ui"

import {
  ERROR_DEFAULT_CONTEXT,
  ERROR_DEFAULT_TOAST,
} from "@lib/constants/error-constants"

export type BaseError<TErrorType extends string = string> = {
  type: TErrorType
  message: string
  timestamp: number
  recoverable: boolean
  onRetry?: () => void
}

/**
 * Hook to manage error state and display error messages
 * @param ErrorEnum - Enum of error types
 * @param errorContext - Context for the error, used in toast messages
 * @returns Object with error state and functions to create, handle, and clear errors
 */
export function useErrors<ErrorEnum extends string>(
  errorContext: string = ERROR_DEFAULT_CONTEXT
) {
  const getRetryAltText = () => `Retry ${errorContext.toLowerCase()} action`
  const [error, setError] = useState<BaseError<ErrorEnum> | null>(null)

  /**
   * Creates a standardized compare error object
   * @param type - Type of error from CompareErrorType enum
   * @param message - Error message
   * @param recoverable - Whether the error allows continued operation
   * @param onRetry - Optional callback to retry the failed operation
   * @returns CompareError object
   */
  const createError = useCallback(
    (
      type: ErrorEnum,
      message: string,
      recoverable = true,
      onRetry?: () => void
    ): BaseError<ErrorEnum> => {
      const newError = {
        type,
        message,
        timestamp: Date.now(),
        recoverable,
        onRetry,
      }

      if (!recoverable) {
        setError(newError)
      }

      return newError
    },
    []
  )

  /**
   * Handles a compare error by showing a toast for recoverable errors
   * or storing the error in state for non-recoverable errors
   * @param error - The error to handle
   * @returns boolean - True if handled as recoverable, false otherwise
   */
  const handleError = useCallback((error: BaseError<ErrorEnum>): boolean => {
    if (error.recoverable) {
      toast.error(`${errorContext}`, {
        description: error.message,
        position: ERROR_DEFAULT_TOAST.POSITION as ToasterPosition,
        dismissable: ERROR_DEFAULT_TOAST.DISMISSABLE,
        action: error.onRetry
          ? {
              altText: getRetryAltText(),
              onClick: error.onRetry,
              label: ERROR_DEFAULT_TOAST.BUTTON_LABEL,
            }
          : undefined,
        duration: ERROR_DEFAULT_TOAST.DURATION,
      })
      return true
    } else {
      setError(error)
      return false
    }
  }, [])

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => setError(null), [])

  return {
    error,
    createError,
    handleError,
    clearError,
  }
}
