"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react"
import { ComparedProduct } from "types/global"

export const MAX_COMPARED_PRODUCTS = 3
export const MIN_COMPARED_PRODUCTS = 2
const COMPARED_PRODUCTS_KEY = "compared_products_list"
const isClient = () => typeof window !== "undefined"

type CompareContextType = {
  comparedProducts: ComparedProduct[]
  addProduct: (product: ComparedProduct) => void
  removeProduct: (productId: string) => void
  clearProducts: () => void
  toggleProduct: (product: ComparedProduct) => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [comparedProducts, setComparedProducts] = useState<ComparedProduct[]>(
    []
  )

  useEffect(() => {
    if (!isClient()) return

    try {
      const comparedProductsStored = localStorage.getItem(COMPARED_PRODUCTS_KEY)
      if (comparedProductsStored)
        setComparedProducts(JSON.parse(comparedProductsStored))
    } catch (error) {
      console.error("Error loading compared products:", error)
    }
  }, [])

  useEffect(() => {
    if (!isClient()) return

    try {
      localStorage.setItem(
        COMPARED_PRODUCTS_KEY,
        JSON.stringify(comparedProducts)
      )
    } catch (error) {
      console.error("Error saving compared products:", error)
    }
  }, [comparedProducts])

  useEffect(() => {
    if (!isClient()) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COMPARED_PRODUCTS_KEY && event.newValue) {
        try {
          setComparedProducts(JSON.parse(event.newValue))
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addProduct = useCallback((product: ComparedProduct) => {
    if (!product.id) throw new Error("Missing product ID")

    setComparedProducts((currentComparedProducts) => {
      if (currentComparedProducts.length >= MAX_COMPARED_PRODUCTS) {
        throw new Error(
          `Cannot add more than ${MAX_COMPARED_PRODUCTS} products`
        )
      }

      if (currentComparedProducts.some((p) => p.id === product.id)) {
        throw new Error("Product already in compare list")
      }

      return [...currentComparedProducts, product]
    })
  }, [])

  const removeProduct = useCallback((productId: string) => {
    if (!productId) throw new Error("Missing product ID")
    setComparedProducts((currentComparedProducts) =>
      currentComparedProducts.filter((p) => p.id !== productId)
    )
  }, [])

  const clearProducts = useCallback(() => {
    setComparedProducts([])
  }, [])

  const toggleProduct = useCallback((product: ComparedProduct) => {
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

  const value = {
    comparedProducts,
    addProduct,
    removeProduct,
    clearProducts,
    toggleProduct,
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
