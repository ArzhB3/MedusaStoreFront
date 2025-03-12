import { useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

import { getProductById } from "@lib/data/products"
import { CompareErrorType, useCompareErrors } from "@lib/errors/compare-errors"
import { useCompareContext } from "@lib/context/compare-context"
import {
  ERROR_COMPARE_MESSAGE,
  MIN_COMPARED_PRODUCTS,
} from "@lib/constants/compare-constants"
import { useRouter } from "next/navigation"

export type UseCompareOptionsType = {
  initialProducts?: HttpTypes.StoreProduct[]
}

type UseCompareReturnType = {
  products: HttpTypes.StoreProduct[]
  isLoading: boolean
  showConfirmDialog: boolean
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>
  handleRemoveProduct: (productId: string) => void
  confirmRemoveProduct: () => void
  cancelRemoveProduct: () => void
}

export function useCompare({
  initialProducts,
}: UseCompareOptionsType = {}): UseCompareReturnType {
  const router = useRouter()
  const { comparedProducts, removeProduct } = useCompareContext()
  const { createError, handleError } = useCompareErrors()

  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(
    initialProducts || []
  )
  const [isLoading, setIsLoading] = useState(!initialProducts)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [productToRemove, setProductToRemove] = useState<string | null>(null)

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      if (products.length <= 2) {
        setProductToRemove(productId)
        setShowConfirmDialog(true)
        return
      }

      removeProduct(productId)
    },
    [products.length, removeProduct]
  )

  const confirmRemoveProduct = useCallback(() => {
    if (productToRemove) {
      removeProduct(productToRemove)
      setShowConfirmDialog(false)
      setProductToRemove(null)
      router.push("/store")
    }
  }, [productToRemove, removeProduct, router])

  const cancelRemoveProduct = useCallback(() => {
    setProductToRemove(null)
    setShowConfirmDialog(false)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!comparedProducts || comparedProducts.length < 2) {
        setProducts([])
        console.info(
          `[useCompare] Not enough products to compare, minimum required: ${MIN_COMPARED_PRODUCTS}`
        )
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const productPromises = comparedProducts
          .map((p) => p.id)
          .map((id) => getProductById(id, { forceRevalidate: true }))

        const fetchedProducts = await Promise.all(productPromises)
        const validProducts = fetchedProducts.filter(
          Boolean
        ) as HttpTypes.StoreProduct[]

        setProducts(validProducts)
      } catch (error) {
        console.error(
          `[useCompare] PRODUCT_REFRESH_FAILED: Unable to refresh ${comparedProducts.length} products data from API`,
          error
        )
        handleError(
          createError(
            CompareErrorType.LOADING_ERROR,
            ERROR_COMPARE_MESSAGE.PRODUCT_REFRESH_FAILED,
            true,
            () => fetchProducts()
          )
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialProducts) {
      fetchProducts()
    }
  }, [comparedProducts, initialProducts, createError, handleError])

  return {
    products,
    isLoading,
    showConfirmDialog,
    setShowConfirmDialog,
    handleRemoveProduct,
    confirmRemoveProduct,
    cancelRemoveProduct,
  }
}
