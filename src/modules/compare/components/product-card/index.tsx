import { memo } from "react"

import type { Product } from "@medusajs/medusa"

import { HttpTypes } from "@medusajs/types"
import { IconButton } from "@medusajs/ui"
import { XCircle } from "@medusajs/icons"
import { useCompare } from "@lib/context/compare-context"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type CompareProductCardProps = {
  product: Product | HttpTypes.StoreProduct
}

const CompareProductCard = ({ product }: CompareProductCardProps) => {
  const { removeProduct } = useCompare()

  if (!product) return null

  const productLink = `/products/${product.handle}`
  const truncatedDescription = product.description
    ? product.description.substring(0, 100) +
      (product.description.length > 100 ? "..." : "")
    : null

  const subtitle = product.subtitle || product.collection?.title || " "
  const tags = product.tags && Array.isArray(product.tags) ? product.tags : []
  const hasTags = tags.length > 0

  const handleRemove = () => removeProduct(product.id)

  return (
    <div
      className="bg-white p-4 rounded border border-gray-200 relative"
      data-testid={`compare-product-card-${product.handle}`}
    >
      <IconButton
        variant="transparent"
        className="absolute top-2 right-2 hover:bg-gray-100 transition-all duration-200"
        onClick={handleRemove}
        data-testid={`remove-compare-product-${product.handle}`}
      >
        <XCircle />
      </IconButton>

      <LocalizedClientLink href={productLink} className="block mb-4">
        <div className="aspect-square w-full relative mb-2">
          <Thumbnail thumbnail={product.thumbnail} size="full" />
        </div>
      </LocalizedClientLink>

      <div className="flex flex-col">
        <h3 className="text-base-semi mb-1">
          <LocalizedClientLink
            href={productLink}
            className="hover:text-ui-fg-base"
          >
            {product.title}
          </LocalizedClientLink>
        </h3>

        <p className="text-base-regular text-ui-fg-muted mb-2">{subtitle}</p>

        {truncatedDescription && (
          <div className="text-ui-fg-muted text-small-regular mb-2">
            {truncatedDescription}
          </div>
        )}

        {hasTags && (
          <div className="mt-2">
            <span className="text-small-regular text-ui-fg-muted">Tags: </span>
            {tags.map((tag) => tag.value).join(", ")}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CompareProductCard)
