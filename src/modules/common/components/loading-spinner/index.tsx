import { Spinner } from "@medusajs/icons"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  className?: string
}

const LoadingSpinner = ({
  size = "medium",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="flex items-center justify-center">
      <Spinner
        className={`text-ui-fg-base ${sizeClasses[size]} ${className}`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
