"use client"

import { useCompareContext } from "@lib/context/compare-context"
import { useCompare, UseCompareOptionsType } from "@lib/hooks/use-compare"

import ComparedProductRemovePrompt from "@modules/compare/components/compared-product-remove-prompt"
import ComparedProductHeader from "@modules/compare/components/compared-product-header"
import ComparedProductAttributes from "@modules/compare/components/compared-product-attributes"
import CompareErrorHandler from "../components/compare-error-handler"
import CompareEmptyMessage from "../components/compare-empty-message"

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
                      <th className="p-4 border text-left bg-ui-bg-component min-w-[180px]"></th>
                      {products.map((product) => (
                        <ComparedProductHeader
                          key={product.id}
                          product={product}
                          removeProduct={handleRemoveProduct}
                        />
                      ))}
                    </tr>
                  </thead>
                  <ComparedProductAttributes products={products} />
                </table>
              </div>

              <ComparedProductRemovePrompt
                isOpen={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={confirmRemoveProduct}
                onCancel={cancelRemoveProduct}
              />
            </>
          ) : (
            <div>
              <CompareEmptyMessage />
            </div>
          )}
        </div>
      </div>
    </CompareErrorHandler>
  )
}

export default CompareTemplate
