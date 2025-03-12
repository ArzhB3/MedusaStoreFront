import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { memo } from "react"

/**
 * Defines the possible display modes for a compare slot.
 * - empty: Initial empty state, indicates no products in comparison yet
 * - placeholder: Additional slot after at least one product is selected
 */
type CompareSlotType = "empty" | "placeholder"

type CompareSlotProps = {
  type: CompareSlotType
  href?: string
  className?: string
}

const compareSlotMessages: Record<CompareSlotType, string> = {
  empty: "Add product to compare",
  placeholder: "Add another product to compare",
}

export const compareSlotStyles = {
  wrapper:
    "w-[122px] h-[122px] border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-center cursor-pointer hover:border-gray-400 hover:text-gray-600 transition-colors",
  container: "flex flex-row gap-4",
}

const CompareSlot = memo(
  ({ type, href = "/store", className = "" }: CompareSlotProps) => (
    <LocalizedClientLink href={href}>
      <div className={`${compareSlotStyles.wrapper} ${className}`}>
        <span className="text-xs">{compareSlotMessages[type]}</span>
      </div>
    </LocalizedClientLink>
  )
)

export default CompareSlot
