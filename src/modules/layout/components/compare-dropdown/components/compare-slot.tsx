import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode, memo } from "react"

export const compareSlotStyles = {
  wrapper:
    "w-[122px] h-[122px] border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-center cursor-pointer hover:border-gray-400 hover:text-gray-600 transition-colors",
  container: "flex flex-row gap-4",
}

type CompareSlotType = "empty" | "placeholder"

interface CompareSlotProps {
  type: CompareSlotType
  href?: string
  className?: string
  children?: ReactNode
}

const CompareSlot = memo(
  ({
    type = "empty",
    href = "/store",
    className = "",
    children,
  }: CompareSlotProps) => (
    <LocalizedClientLink href={href}>
      <div className={`${compareSlotStyles.wrapper} ${className}`}>
        {children || (
          <span className="text-xs">
            {type === "placeholder"
              ? "Add another product to compare"
              : "Add product to compare"}
          </span>
        )}
      </div>
    </LocalizedClientLink>
  )
)

export default CompareSlot
