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

type ButtonStyles = {
  base: string
  compared: string
  full: string
  default: string
}

type IconStyles = {
  base: string
  productTemplate: string
  default: string
  hover: {
    hide: string
    show: string
  }
}

type TextStyles = {
  base: string
  full: string
  default: string
}

type CompareButtonStyles = {
  button: ButtonStyles
  icon: IconStyles
  text: TextStyles
}

type CompareToggleButtonProps = {
  product: HttpTypes.StoreProduct
  isInProductTemplate?: boolean
}

function CompareToggleButton({
  product,
  isInProductTemplate = false,
}: CompareToggleButtonProps) {
  const { comparedProducts, toggleProduct, isProductCompared } =
    useCompareContext()

  const isCompared = isProductCompared(product.id)
  const isComparedFull =
    comparedProducts.length >= MAX_COMPARED_PRODUCTS && !isCompared

  const styles: CompareButtonStyles = {
    button: {
      base: "group flex rounded-md transition-all duration-300 pr-2 pl-1",
      compared: "bg-green-500 hover:bg-green-600",
      full: "border !border-slate-300 cursor-not-allowed",
      default: "bg-slate hover:bg-slate-400",
    },
    icon: {
      base: "absolute transition-all duration-300",
      productTemplate: "text-slate-900 dark:text-slate-50",
      default: "text-slate-900",
      hover: {
        hide: "opacity-100 rotate-0 group-hover:opacity-0 group-hover:rotate-90",
        show: "opacity-0 -rotate-90 group-hover:opacity-100 group-hover:rotate-0 group-hover:text-slate-50 dark:group-hover:text-slate-900",
      },
    },
    text: {
      base: "max-w-0 overflow-hidden text-sm whitespace-nowrap transition-all duration-300 group-hover:max-w-[200px] group-hover:pl-2",
      full: "!text-slate-600",
      default: "text-slate-50 dark:text-slate-900",
    },
  }

  const buttonStyles = [
    styles.button.base,
    isCompared
      ? styles.button.compared
      : isComparedFull
      ? styles.button.full
      : styles.button.default,
  ].join(" ")

  const iconBaseStyles = [
    styles.icon.base,
    isInProductTemplate ? styles.icon.productTemplate : styles.icon.default,
  ].join(" ")

  const textStyles = [
    styles.text.base,
    isComparedFull ? styles.text.full : styles.text.default,
  ].join(" ")

  const buttonText = isCompared
    ? "Already in compare list"
    : isComparedFull
    ? "Compare list full"
    : "Add to compare"

  const showCompareToast = useCallback(
    (isRemoved: boolean, productTitle: string) => {
      const toastConfig = {
        description: isRemoved
          ? COMPARE_TOAST.REMOVED.DESCRIPTION(productTitle)
          : COMPARE_TOAST.ADDED.DESCRIPTION(productTitle),
        dismissable: DEFAULT_TOAST.DISMISSABLE,
        position: DEFAULT_TOAST.POSITION as ToasterPosition,
        duration: DEFAULT_TOAST.DURATION,
      }

      if (isRemoved) {
        toast.info(COMPARE_TOAST.REMOVED.TITLE, toastConfig)
      } else {
        toast.success(COMPARE_TOAST.ADDED.TITLE, toastConfig)
      }
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (isComparedFull) return

      toggleProduct(product)
      showCompareToast(isCompared, product.title)
    },
    [isComparedFull, product, isCompared, toggleProduct, showCompareToast]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Button
        className={buttonStyles}
        variant="transparent"
        data-testid="compared-product-toggle-button"
        type="submit"
        disabled={isComparedFull}
      >
        <span className={textStyles}>{buttonText}</span>
        <div className="relative w-4 h-4">
          {isCompared ? (
            <Check className="text-slate-50 dark:text-slate-900" />
          ) : isComparedFull ? (
            <GridList className="!text-slate-600" />
          ) : (
            <>
              <GridList
                className={`${iconBaseStyles} ${styles.icon.hover.hide}`}
              />
              <Plus
                className={`absolute transition-all duration-300 ${styles.icon.hover.show}`}
              />
            </>
          )}
        </div>
      </Button>
    </form>
  )
}

export default memo(CompareToggleButton)
