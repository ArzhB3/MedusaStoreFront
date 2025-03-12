"use client"

import { PropsWithChildren } from "react"

import { useCompareContext } from "@lib/context/compare-context"
import { ERROR_COMPARE_PAGE } from "@lib/constants/compare-constants"

import ErrorBoundary from "@modules/common/components/error-boundary"

const CompareErrorHandler = ({ children }: PropsWithChildren) => {
  const { isLoading, error } = useCompareContext()

  return (
    <ErrorBoundary
      isLoading={isLoading}
      error={error}
      fallbackMessage={ERROR_COMPARE_PAGE.FALLBACK_MESSAGE}
    >
      {children}
    </ErrorBoundary>
  )
}

export default CompareErrorHandler
