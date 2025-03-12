import { PropsWithChildren } from "react"

import { BaseError } from "@lib/hooks/use-errors"

import ErrorPage from "@modules/common/components/error-page"
import LoadingSpinner from "@modules/common/components/loading-spinner"

type ErrorBoundaryProps<TErrorType extends string = string> =
  PropsWithChildren<{
    isLoading?: boolean
    error?: BaseError<TErrorType> | null
    fallbackMessage?: string
    actionLink?: {
      text: string
      href: string
    }
  }>

const ErrorBoundary = <TErrorType extends string>({
  children,
  isLoading = false,
  error = null,
  fallbackMessage,
  actionLink,
}: ErrorBoundaryProps<TErrorType>) => {
  if (error && !error.recoverable) {
    return (
      <ErrorPage
        error={error}
        fallbackMessage={fallbackMessage}
        actionLink={actionLink}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="content-container py-12 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}

export default ErrorBoundary
