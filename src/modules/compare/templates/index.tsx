"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCompare } from "@lib/context/compare-context"
import { getProductById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import RemoveProductPrompt from "@modules/compare/components/remove-product-prompt"
import ProductHeader from "@modules/compare/components/product-header"
import ProductAttributes from "@modules/compare/components/product-attributes"
import EmptyCompareMessage from "../components/empty-compare-message"

interface CompareTemplateProps {
  initialProducts?: HttpTypes.StoreProduct[]
}

const CompareTemplate = ({ initialProducts }: CompareTemplateProps) => {
  const { comparedProducts: comparedProductsFromContext, removeProduct } =
    useCompare()
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(
    initialProducts || []
  )
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [productToRemove, setProductToRemove] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      if (
        !comparedProductsFromContext ||
        comparedProductsFromContext.length < 2
      ) {
        return
      }

      try {
        const productPromises = comparedProductsFromContext
          .map((p) => p.id)
          .map((id) => getProductById(id, { forceRevalidate: true }))

        const fetchedProducts = await Promise.all(productPromises)
        const validProducts = fetchedProducts.filter(
          Boolean
        ) as HttpTypes.StoreProduct[]

        setProducts(validProducts)
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    if (!initialProducts) {
      fetchProducts()
    }
  }, [comparedProductsFromContext, initialProducts])

  const handleRemoveProduct = (productId: string) => {
    if (products.length <= 2) {
      setProductToRemove(productId)
      setShowConfirmDialog(true)
      return
    }

    removeProduct(productId)
  }

  const confirmRemoveProduct = () => {
    if (productToRemove) {
      removeProduct(productToRemove)
      setShowConfirmDialog(false)
      setProductToRemove(null)
      router.push("/store")
    }
  }

  const cancelRemoveProduct = () => {
    setProductToRemove(null)
    setShowConfirmDialog(false)
  }

  return (
    <div className="py-6">
      <div className="content-container" data-testid="compare-container">
        {comparedProductsFromContext.length >= 2 ? (
          <>
            <h1 className="text-2xl-semi text-ui-fg-base mb-8">
              Compare Products
            </h1>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border text-left bg-gray-50 min-w-[180px]"></th>
                    {products.map((product) => (
                      <ProductHeader
                        key={product.id}
                        product={product}
                        removeProduct={handleRemoveProduct}
                      />
                    ))}
                  </tr>
                </thead>
                <ProductAttributes products={products} />
              </table>
            </div>

            <RemoveProductPrompt
              isOpen={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
              onConfirm={confirmRemoveProduct}
              onCancel={cancelRemoveProduct}
            />
          </>
        ) : (
          <div>
            <EmptyCompareMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CompareTemplate
