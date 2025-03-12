"use client"

import { useCompareContext } from "@lib/context/compare-context"
import { useCompare, UseCompareOptionsType } from "@lib/hooks/use-compare"

import RemoveProductPrompt from "@modules/compare/components/remove-product-prompt"
import ProductHeader from "@modules/compare/components/product-header"
import ProductAttributes from "@modules/compare/components/product-attributes"
import CompareErrorHandler from "../components/compare-error-handler"
import EmptyCompareMessage from "../components/empty-compare-message"

type CompareTemplateProps = UseCompareOptionsType

const CompareTemplate = ({ initialProducts }: CompareTemplateProps) => {
  const { comparedProducts } = useCompareContext()
  const {
    products,
    showConfirmDialog,
    setShowConfirmDialog,
    handleRemoveProduct,
    confirmRemoveProduct,
    cancelRemoveProduct,
  } = useCompare({ initialProducts })

  return (
    <CompareErrorHandler>
      <div className="py-6">
        <div className="content-container" data-testid="compare-container">
          {comparedProducts.length >= 2 ? (
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
    </CompareErrorHandler>
  )
}

export default CompareTemplate
