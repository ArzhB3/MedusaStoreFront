"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductById } from "@lib/data/products"
import {
  CompareErrorType,
  CompareError,
  useCompareErrors,
} from "@lib/errors/compare-errors"
import {
  COMPARED_PRODUCTS_KEY,
  COMPARED_PRODUCTS_REFRESH_THRESHOLD,
  ERROR_COMPARE_MESSAGE,
  MAX_COMPARED_PRODUCTS,
} from "@lib/constants/compare-constants"

type BaseCompareContextType = {
  comparedProducts: HttpTypes.StoreProduct[]
  lastRefreshTimestamp: number | null
  toggleProduct: (product: HttpTypes.StoreProduct) => void
  removeProduct: (productId: string) => void
  removeAllProducts: () => void
  refreshProductsData: () => Promise<void>
}

type CompareUtilities = {
  isProductCompared: (productId: string) => boolean
}

type CompareErrorHandling = {
  isLoading: boolean
  error: CompareError | null
}

type CompareContextType = BaseCompareContextType &
  CompareUtilities &
  CompareErrorHandling

type ComparedProductsStorage = {
  comparedProducts: HttpTypes.StoreProduct[]
  refreshTimestamp: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

const isClient = () => typeof window !== "undefined"

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const { error, createError, handleError, clearError } = useCompareErrors()

  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [comparedProducts, setComparedProducts] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<
    number | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)

  const comparedProductIds = useMemo(
    () => comparedProducts.map((p) => p.id),
    [comparedProducts]
  )

  const isProductCompared = useCallback(
    (productId: string) => comparedProducts.some((p) => p.id === productId),
    [comparedProducts]
  )

  /**
   * Toggles a product in the compared products list
   * @param product - The product to toggle
   */
  const toggleProduct = useCallback(
    (product: HttpTypes.StoreProduct) => {
      if (!product.id) {
        console.error(
          `[CompareContext] PRODUCT_MISSING_ID: Product object is missing required ID property`,
          product
        )
        handleError(
          createError(
            CompareErrorType.LOADING_ERROR,
            ERROR_COMPARE_MESSAGE.PRODUCT_MISSING_ID,
            false
          )
        )
        return
      }

      setComparedProducts((currentComparedProducts) => {
        const exists = currentComparedProducts.some((p) => p.id === product.id)

        if (exists) {
          return currentComparedProducts.filter((p) => p.id !== product.id)
        } else {
          if (currentComparedProducts.length >= MAX_COMPARED_PRODUCTS) {
            console.error(
              `[CompareContext] PRODUCT_LIMIT_REACHED: Attempted to add product ${product.id} but already at maximum capacity (${currentComparedProducts.length}/${MAX_COMPARED_PRODUCTS})`
            )
            handleError(
              createError(
                CompareErrorType.PRODUCT_LIMIT_REACHED,
                ERROR_COMPARE_MESSAGE.PRODUCT_LIMIT_REACHED,
                false
              )
            )
            return currentComparedProducts
          }
          return [...currentComparedProducts, product]
        }
      })
    },
    [createError, handleError]
  )

  /**
   * Removes a product from the compared products list
   * @param productId - The ID of the compared product to remove from the list
   */
  const removeProduct = useCallback(
    (productId: string) => {
      if (!productId) {
        handleError(
          createError(
            CompareErrorType.LOADING_ERROR,
            ERROR_COMPARE_MESSAGE.PRODUCT_MISSING_ID,
            false
          )
        )
        return
      }

      setComparedProducts((currentComparedProducts) => {
        const updatedProducts = currentComparedProducts.filter(
          (p) => p.id !== productId
        )

        if (updatedProducts.length === 0) {
          setLastRefreshTimestamp(null)
        }

        return updatedProducts
      })
    },
    [createError, handleError]
  )

  /**
   * Removes all compared products from the comparison list
   */
  const removeAllProducts = useCallback(() => {
    setComparedProducts([])
    setLastRefreshTimestamp(null)
  }, [])

  /*
   * Checks if the compared products data needs to be refreshed
   */
  const isDataRefreshRequired = useCallback(() => {
    if (!lastRefreshTimestamp) return true
    const currentTime = Date.now()
    return (
      currentTime - lastRefreshTimestamp > COMPARED_PRODUCTS_REFRESH_THRESHOLD
    )
  }, [lastRefreshTimestamp])

  /*
   * Refreshes product data for all compared products
   */
  const refreshProductsData = useCallback(async () => {
    if (!comparedProducts || comparedProducts.length === 0) return

    setIsLoading(true)
    clearError()

    try {
      const productPromises = comparedProducts
        .map((p) => p.id)
        .map((id) => getProductById(id, { forceRevalidate: true }))

      const freshComparedProducts = await Promise.all(productPromises)
      const validComparedProducts = freshComparedProducts.filter(
        Boolean
      ) as HttpTypes.StoreProduct[]

      if (validComparedProducts.length > 0) {
        setComparedProducts(validComparedProducts)

        const comparedProductsToStore: ComparedProductsStorage = {
          comparedProducts: validComparedProducts,
          refreshTimestamp: Date.now(),
        }
        localStorage.setItem(
          COMPARED_PRODUCTS_KEY,
          JSON.stringify(comparedProductsToStore)
        )
        setLastRefreshTimestamp(comparedProductsToStore.refreshTimestamp)
      } else {
        handleError(
          createError(
            CompareErrorType.REFRESH_ERROR,
            ERROR_COMPARE_MESSAGE.PRODUCT_REFRESH_FAILED,
            true,
            refreshProductsData
          )
        )
      }
    } catch (error) {
      console.error(
        `[CompareContext] PRODUCT_REFRESH_FAILED: Unable to refresh ${comparedProducts.length} products data from API`,
        error
      )
      handleError(
        createError(
          CompareErrorType.REFRESH_ERROR,
          ERROR_COMPARE_MESSAGE.PRODUCT_REFRESH_FAILED,
          true,
          refreshProductsData
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [comparedProductIds, createError, handleError])

  /**
   * Load compared products from local storage
   */
  useEffect(() => {
    if (!isClient()) return

    try {
      const comparedProductsStorage = localStorage.getItem(
        COMPARED_PRODUCTS_KEY
      )
      if (comparedProductsStorage) {
        const parsedComparedProducts: ComparedProductsStorage = JSON.parse(
          comparedProductsStorage
        )
        setComparedProducts(parsedComparedProducts.comparedProducts)
        setLastRefreshTimestamp(parsedComparedProducts.refreshTimestamp)
      }
    } catch (error) {
      console.error(
        `[CompareContext] STORAGE_LOAD_FAILED: Failed to parse or retrieve products from localStorage (key=${COMPARED_PRODUCTS_KEY})`,
        error
      )
      handleError(
        createError(
          CompareErrorType.STORAGE_ERROR,
          ERROR_COMPARE_MESSAGE.STORAGE_LOAD_FAILED,
          false
        )
      )
    } finally {
      setInitialLoadComplete(true)
    }
  }, [createError, handleError])

  /**
   * Save compared products to local storage
   */
  useEffect(() => {
    if (!isClient() || !initialLoadComplete) return

    if (comparedProducts.length === 0) {
      localStorage.removeItem(COMPARED_PRODUCTS_KEY)
      return
    }

    try {
      const comparedProductsToStore: ComparedProductsStorage = {
        comparedProducts,
        refreshTimestamp: lastRefreshTimestamp || Date.now(),
      }

      localStorage.setItem(
        COMPARED_PRODUCTS_KEY,
        JSON.stringify(comparedProductsToStore)
      )

      if (!lastRefreshTimestamp) {
        setLastRefreshTimestamp(comparedProductsToStore.refreshTimestamp)
      }
    } catch (error) {
      console.error(
        `[CompareContext] STORAGE_SAVE_FAILED: Unable to serialize or write products to localStorage (key=${COMPARED_PRODUCTS_KEY})`,
        error
      )
      handleError(
        createError(
          CompareErrorType.STORAGE_ERROR,
          ERROR_COMPARE_MESSAGE.STORAGE_SAVE_FAILED,
          false
        )
      )
    }
  }, [
    comparedProducts,
    lastRefreshTimestamp,
    initialLoadComplete,
    createError,
    handleError,
  ])

  /**
   * Listen for storage events to update compared products
   */
  useEffect(() => {
    if (!isClient()) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COMPARED_PRODUCTS_KEY) {
        if (event.newValue === null) {
          setComparedProducts([])
          setLastRefreshTimestamp(null)
        } else if (event.newValue) {
          try {
            const parsedComparedProducts: ComparedProductsStorage = JSON.parse(
              event.newValue
            )
            setComparedProducts(parsedComparedProducts.comparedProducts)
            setLastRefreshTimestamp(parsedComparedProducts.refreshTimestamp)
          } catch (error) {
            console.error(
              `[CompareContext] STORAGE_SYNC_FAILED: Could not parse data from storage event (key=${event?.key}, newValue =${event?.newValue})`,
              error
            )
            handleError(
              createError(
                CompareErrorType.STORAGE_ERROR,
                ERROR_COMPARE_MESSAGE.STORAGE_SYNC_FAILED,
                true,
                () => handleStorageChange(event)
              )
            )
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [createError, handleError])

  /**
   * Refresh compared products data if needed
   */
  useEffect(() => {
    if (isDataRefreshRequired() && comparedProducts.length > 0) {
      refreshProductsData()
    }
  }, [isDataRefreshRequired, refreshProductsData, comparedProducts])

  const value = useMemo(
    () => ({
      comparedProducts,
      lastRefreshTimestamp,
      toggleProduct,
      removeProduct,
      removeAllProducts,
      refreshProductsData,
      isProductCompared,
      isLoading,
      error,
      clearError,
    }),
    [
      comparedProducts,
      lastRefreshTimestamp,
      toggleProduct,
      removeProduct,
      removeAllProducts,
      refreshProductsData,
      isProductCompared,
      isLoading,
      error,
      clearError,
    ]
  )

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export const useCompareContext = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompareContext must be used within a CompareProvider")
  }

  return context
}
