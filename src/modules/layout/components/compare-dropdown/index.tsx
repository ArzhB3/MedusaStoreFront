"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { Button, IconButton } from "@medusajs/ui"
import { PlusMini, XCircle } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CompareDropdown = ({
  compare: compareState,
}: {
  compare?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false)

  const open = () => setCompareDropdownOpen(true)
  const close = () => setCompareDropdownOpen(false)

  const totalItems =
    compareState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open compare dropdown when modifying the compare items, but only if we're not on the compare page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/compare")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      //onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base"
            href="/compare"
            data-testid="nav-compare-link"
          >{`Compare (${totalItems})`}</LocalizedClientLink>
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
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
            data-testid="nav-compare-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Compare</h3>
            </div>
            {compareState && compareState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-4 gap-8 no-scrollbar p-px">
                  {compareState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4 relative"
                        key={item.id}
                        data-testid="compare-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <IconButton
                          variant="transparent"
                          className="absolute top-0 right-[-24px] hover:bg-gray-300"
                        >
                          <XCircle />
                        </IconButton>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <LocalizedClientLink href="/compare" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-compare-button"
                    >
                      Go to compare
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Your compare list is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Explore products</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CompareDropdown
