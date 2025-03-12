import { Heading, Text } from "@medusajs/ui"

import { BaseError } from "@lib/hooks/use-errors"
import { ERROR_DEFAULT_PAGE } from "@lib/constants/error-constants"

import InteractiveLink from "@modules/common/components/interactive-link"

type ErrorPageProps<TErrorType extends string = string> = {
  error: BaseError<TErrorType>
  fallbackMessage?: string
  actionLink?: {
    text: string
    href: string
  }
}

const ErrorPage = <TErrorType extends string>({
  error,
  fallbackMessage = ERROR_DEFAULT_PAGE.FALLBACK_MESSAGE,
  actionLink = {
    text: ERROR_DEFAULT_PAGE.REDIRECT_LABEL,
    href: ERROR_DEFAULT_PAGE.REDIRECT_LINK,
  },
}: ErrorPageProps<TErrorType>) => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="error-page"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {ERROR_DEFAULT_PAGE.MAIN_MESSAGE}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {error.message || fallbackMessage}
      </Text>
      <div className="flex gap-4">
        <InteractiveLink href={actionLink.href}>
          {actionLink.text}
        </InteractiveLink>
      </div>
    </div>
  )
}

export default ErrorPage
