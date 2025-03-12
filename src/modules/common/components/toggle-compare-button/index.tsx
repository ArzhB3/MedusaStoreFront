"use client"

import { useCallback, memo } from "react"

import { HttpTypes } from "@medusajs/types"
import { Button, toast, ToasterPosition } from "@medusajs/ui"
import { GridList, Plus, Check } from "@medusajs/icons"

import { useCompareContext } from "@lib/context/compare-context"
import { DEFAULT_TOAST } from "@lib/constants/global-constants"
import {
  COMPARE_TOAST,
  MAX_COMPARED_PRODUCTS,
} from "@lib/constants/compare-constants"

type ToggleCompareButtonProps = {
  product: HttpTypes.StoreProduct
}

function ToggleCompareButton({ product }: ToggleCompareButtonProps) {
  const { comparedProducts, toggleProduct, isProductCompared } =
    useCompareContext()

  const isCompared = isProductCompared(product.id)
  const isComparedFull =
    comparedProducts.length >= MAX_COMPARED_PRODUCTS && !isCompared

  const buttonStyles = `group flex rounded-md transition-all duration-300 pr-2 pl-1 ${
    isCompared
      ? "bg-green-600 hover:bg-green-600"
      : isComparedFull
      ? "bg-gray-300 border border-gray-400 cursor-not-allowed"
      : "bg-gray hover:bg-gray-400"
  }`

  const buttonText = isCompared
    ? "Already in compare list"
    : isComparedFull
    ? "Compare list full"
    : "Add to compare"

  const textStyles = `max-w-0 overflow-hidden text-sm whitespace-nowrap transition-all duration-300 group-hover:max-w-[200px] group-hover:pl-2 ${
    isComparedFull ? "text-gray-600" : "text-white"
  }`

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (isComparedFull) return

      toggleProduct(product)

      isCompared
        ? toast.info(COMPARE_TOAST.REMOVED.TITLE, {
            description: COMPARE_TOAST.REMOVED.DESCRIPTION(product.title),
            dismissable: DEFAULT_TOAST.DISMISSABLE,
            position: DEFAULT_TOAST.POSITION as ToasterPosition,
            duration: DEFAULT_TOAST.DURATION,
          })
        : toast.success(COMPARE_TOAST.ADDED.TITLE, {
            description: COMPARE_TOAST.ADDED.DESCRIPTION(product.title),
            dismissable: DEFAULT_TOAST.DISMISSABLE,
            position: DEFAULT_TOAST.POSITION as ToasterPosition,
            duration: DEFAULT_TOAST.DURATION,
          })
    },
    [isComparedFull, product, isCompared, toggleProduct]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Button
        className={buttonStyles}
        variant="transparent"
        data-testid="add-to-compare"
        type="submit"
        disabled={isComparedFull}
      >
        <span className={textStyles}>{buttonText}</span>
        <div className="relative w-4 h-4">
          {isCompared ? (
            <Check className="text-white" />
          ) : isComparedFull ? (
            <GridList className="text-gray-600" />
          ) : (
            <>
              <GridList className="absolute transition-all duration-300 opacity-100 rotate-0 group-hover:opacity-0 group-hover:rotate-90" />
              <Plus className="absolute transition-all duration-300 opacity-0 -rotate-90 group-hover:opacity-100 group-hover:rotate-0 group-hover:text-white" />
            </>
          )}
        </div>
      </Button>
    </form>
  )
}

export default memo(ToggleCompareButton)
