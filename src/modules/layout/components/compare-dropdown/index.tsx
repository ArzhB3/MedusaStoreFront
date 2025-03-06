"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { Button, IconButton } from "@medusajs/ui"
import { XCircle, Trash } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

import { useCompare, MIN_COMPARED_PRODUCTS } from "@lib/context/compare-context"

import CompareSlot, { compareSlotStyles } from "./components/compare-slot"

const CompareDropdown = () => {
  const { comparedProducts = [], removeProduct, clearProducts } = useCompare()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false)

  const totalComparedProducts = comparedProducts.length
  const pathname = usePathname()

  const clearActiveTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const open = useCallback(() => setCompareDropdownOpen(true), [])
  const close = useCallback(() => setCompareDropdownOpen(false), [])

  const openAndCancel = useCallback(() => {
    if (pathname.includes("/compare")) {
      return
    }
    clearActiveTimer()
    open()
  }, [clearActiveTimer, open, pathname])

  useEffect(() => {
    return clearActiveTimer
  }, [clearActiveTimer])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base"
            href="/compare"
            data-testid="nav-compare-link"
          >{`Compare (${totalComparedProducts})`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={compareDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-auto text-ui-fg-base"
            data-testid="nav-compare-dropdown"
          >
            <div className="p-4 relative">
              <h3 className="text-large-semi text-center">Compare</h3>
              {totalComparedProducts >= MIN_COMPARED_PRODUCTS && (
                <IconButton
                  variant="transparent"
                  className="transition-all duration-300 ease-in-out absolute top-1/2 right-4 -translate-y-1/2 hover:text-red-600 hover:bg-gray-300"
                  onClick={clearProducts}
                  data-testid="clear-all-compare-product-button"
                  title="Clear all"
                >
                  <Trash />
                </IconButton>
              )}
            </div>
            <div className="overflow-y-scroll max-h-[402px] px-4 flex flex-row gap-4 no-scrollbar p-px">
              {totalComparedProducts > 0 ? (
                <>
                  {comparedProducts.map((product) => (
                    <div
                      className="w-[122px] relative transition-all duration-300 ease-in-out"
                      key={product.id}
                      data-testid="compare-product-{product.handle}"
                    >
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="w-24"
                      >
                        <Thumbnail
                          thumbnail={product.thumbnail}
                          size="square"
                        />
                      </LocalizedClientLink>
                      <IconButton
                        variant="transparent"
                        className="absolute top-0 right-0 hover:bg-gray-300 transition-all duration-300 ease-in-out"
                        onClick={() => removeProduct(product.id)}
                        data-testid="clear-compare-product-{product.handle}-button"
                      >
                        <XCircle />
                      </IconButton>
                    </div>
                  ))}
                  {totalComparedProducts === 1 && (
                    <CompareSlot type="placeholder" />
                  )}
                </>
              ) : (
                <div className={compareSlotStyles.container}>
                  {[...Array(2)].map((_, index) => (
                    <CompareSlot key={`empty-${index}`} type="empty" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-4 px-4 py-4 text-small-regular">
              <LocalizedClientLink href="/compare" passHref>
                <Button
                  className={`w-full transition-all duration-300 ease-in-out transform ${
                    totalComparedProducts < MIN_COMPARED_PRODUCTS
                      ? "opacity-80 hover:opacity-90"
                      : "opacity-100 hover:scale-[1.02]"
                  }`}
                  size="large"
                  disabled={totalComparedProducts < MIN_COMPARED_PRODUCTS}
                  data-testid="go-to-compare-button"
                >
                  {totalComparedProducts < MIN_COMPARED_PRODUCTS
                    ? `Add ${
                        MIN_COMPARED_PRODUCTS - totalComparedProducts
                      } more product${
                        MIN_COMPARED_PRODUCTS - totalComparedProducts === 1
                          ? ""
                          : "s"
                      } to compare`
                    : "Go to compare"}
                </Button>
              </LocalizedClientLink>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CompareDropdown
