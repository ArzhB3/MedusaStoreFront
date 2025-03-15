import { memo } from "react"

import type { Product } from "@medusajs/medusa"

import { HttpTypes } from "@medusajs/types"
import { IconButton } from "@medusajs/ui"
import { XCircle } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type ComparedProductHeaderProps = {
  product: HttpTypes.StoreProduct | Product
  removeProduct: (productId: string) => void
}

const ComparedProductHeader = ({
  product,
  removeProduct,
}: ComparedProductHeaderProps) => {
  if (!product) return null

  const productUrl = product.handle ? `/products/${product.handle}` : "#"

  return (
    <th className="p-4 border min-w-[250px] relative">
      <IconButton
        variant="transparent"
        className="absolute top-2 right-2 hover:bg-ui-bg-base-hover"
        onClick={() => removeProduct(product.id)}
        aria-label={`Remove ${product.title} from comparison`}
      >
        <XCircle />
      </IconButton>

      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-4 relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            size="square"
            className="object-contain w-full h-full"
          />
        </div>
        <h3 className="text-base-semi mb-1 text-center">
          <LocalizedClientLink
            href={productUrl}
            className="hover:text-ui-fg-base"
          >
            {product.title}
          </LocalizedClientLink>
        </h3>
      </div>
    </th>
  )
}

export default memo(ComparedProductHeader)
