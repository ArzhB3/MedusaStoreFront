"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductById } from "@lib/data/products"

type ComparedProductsStorage = {
  comparedProducts: HttpTypes.StoreProduct[]
  refreshTimestamp: number
}

type CompareContextType = {
  comparedProducts: HttpTypes.StoreProduct[]
  lastRefreshTimestamp: number | null
  toggleProduct: (product: HttpTypes.StoreProduct) => void
  removeProduct: (productId: string) => void
  removeAllProducts: () => void
  refreshProductsData: () => Promise<void>
}

export const MIN_COMPARED_PRODUCTS = 2
export const MAX_COMPARED_PRODUCTS = 3
const COMPARED_PRODUCTS_KEY = "compared_products_list"
const COMPARED_PRODUCTS_REFRESH_THRESHOLD = 1000 * 60 * 30 // 30 minutes
const CompareContext = createContext<CompareContextType | undefined>(undefined)
const isClient = () => typeof window !== "undefined"

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [comparedProducts, setComparedProducts] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<
    number | null
  >(null)

  // ------------------------------ Compared Products Management Functions ------------------------------ //

  /**
   * Toggles a product in the compared products list
   * @param product - The product to toggle
   */
  const toggleProduct = useCallback((product: HttpTypes.StoreProduct) => {
    if (!product.id) throw new Error("Missing product ID")

    setComparedProducts((currentComparedProducts) => {
      const exists = currentComparedProducts.some((p) => p.id === product.id)

      if (exists) {
        return currentComparedProducts.filter((p) => p.id !== product.id)
      } else {
        if (currentComparedProducts.length >= MAX_COMPARED_PRODUCTS) {
          console.error(
            `Cannot add more than ${MAX_COMPARED_PRODUCTS} products`
          )
          return currentComparedProducts
        }
        return [...currentComparedProducts, product]
      }
    })
  }, [])

  /**
   * Removes a product from the compared products list
   * @param productId - The ID of the compared product to remove from the list
   */
  const removeProduct = useCallback((productId: string) => {
    if (!productId) throw new Error("Missing product ID")

    setComparedProducts((currentComparedProducts) => {
      const updatedProducts = currentComparedProducts.filter(
        (p) => p.id !== productId
      )

      if (updatedProducts.length === 0) {
        setLastRefreshTimestamp(null)
      }

      return updatedProducts
    })
  }, [])

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

        const comparedProductstoStore: ComparedProductsStorage = {
          comparedProducts: validComparedProducts,
          refreshTimestamp: Date.now(),
        }
        localStorage.setItem(
          COMPARED_PRODUCTS_KEY,
          JSON.stringify(comparedProductstoStore)
        )
        setLastRefreshTimestamp(comparedProductstoStore.refreshTimestamp)
      }
    } catch (error) {
      console.error("Error refreshing product data:", error)
    }
  }, [comparedProducts.map((p) => p.id).join(",")])

  // ------------------------------ Local Storage Management ------------------------------ //

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
      console.error("Error loading compared products:", error)
    } finally {
      setInitialLoadComplete(true)
    }
  }, [])

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
      const comparedProductstoStore: ComparedProductsStorage = {
        comparedProducts,
        refreshTimestamp: lastRefreshTimestamp || Date.now(),
      }

      localStorage.setItem(
        COMPARED_PRODUCTS_KEY,
        JSON.stringify(comparedProductstoStore)
      )

      if (!lastRefreshTimestamp) {
        setLastRefreshTimestamp(comparedProductstoStore.refreshTimestamp)
      }
    } catch (error) {
      console.error("Error saving compared products:", error)
    }
  }, [comparedProducts, lastRefreshTimestamp, initialLoadComplete])

  /**
   * Listen for storage events to update compared products
   */
  useEffect(() => {
    if (!isClient()) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COMPARED_PRODUCTS_KEY && event.newValue) {
        try {
          const parsedComparedProducts: ComparedProductsStorage = JSON.parse(
            event.newValue
          )
          setComparedProducts(parsedComparedProducts.comparedProducts)
          setLastRefreshTimestamp(parsedComparedProducts.refreshTimestamp)
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  /**
   * Refresh compared products data if needed
   */
  useEffect(() => {
    if (isDataRefreshRequired() && comparedProducts.length > 0) {
      refreshProductsData()
    }
  }, [isDataRefreshRequired, refreshProductsData, comparedProducts])

  const value = {
    comparedProducts,
    lastRefreshTimestamp,
    toggleProduct,
    removeProduct,
    removeAllProducts,
    refreshProductsData,
  }

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
