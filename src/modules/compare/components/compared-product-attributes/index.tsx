import { ReactNode } from "react"

import type { Product } from "@medusajs/medusa"

import { HttpTypes } from "@medusajs/types"

type ComparedProductAttributesProps = {
  products: HttpTypes.StoreProduct[] | Product[]
}

interface ComparedProductMetadata {
  weight?: string
  material?: string
  country_of_origin?: string
  type?: string
  dimensions?: string
  height?: string
  width?: string
  length?: string
  weight_unit?: string
  dimension_unit?: string
}

interface AttributeConfig {
  name: string
  getValue: (product: any) => ReactNode | string
}

const ComparedProductAttributes = ({
  products,
}: ComparedProductAttributesProps) => {
  const getMetadata = (product: any): ComparedProductMetadata => {
    if (!product) return {}

    if (product.metadata) return product.metadata

    const metadata: ComparedProductMetadata = {}

    if (product.weight) metadata.weight = product.weight.toString()
    if (product.material) metadata.material = product.material
    if (product.origin_country)
      metadata.country_of_origin = product.origin_country
    if (product.type) metadata.type = product.type

    if (product.height && product.width && product.length) {
      metadata.height = product.height.toString()
      metadata.width = product.width.toString()
      metadata.length = product.length.toString()
    }

    return metadata
  }

  const getMaterial = (product: any): string => {
    const metadata = getMetadata(product)
    return metadata.material || product.material || "Not specified"
  }

  const getCountryOfOrigin = (product: any): string => {
    const metadata = getMetadata(product)
    return (
      metadata.country_of_origin || product.origin_country || "Not specified"
    )
  }

  const getType = (product: any): string => {
    const metadata = getMetadata(product)
    return metadata.type || product.type || "Not specified"
  }

  const getWeight = (product: any): string => {
    const metadata = getMetadata(product)
    if (metadata.weight) {
      return `${metadata.weight} ${metadata.weight_unit || "g"}`
    }
    if (product.weight) {
      return `${product.weight} g`
    }
    return "Not specified"
  }

  const getDimensions = (product: any): string => {
    const metadata = getMetadata(product)

    if (metadata.dimensions) {
      return metadata.dimensions
    }

    if (metadata.length && metadata.width && metadata.height) {
      return `${metadata.length} × ${metadata.width} × ${metadata.height} ${
        metadata.dimension_unit || "cm"
      }`
    }

    if (product.length && product.width && product.height) {
      return `${product.length} × ${product.width} × ${product.height} cm`
    }

    return "Not specified"
  }

  const getDescription = (product: any): ReactNode => (
    <div className="text-ui-fg-muted text-small-regular">
      {product.description?.substring(0, 100)}
      {product.description && product.description.length > 100 ? "..." : ""}
    </div>
  )

  const getCollection = (product: any): string =>
    product.collection?.title || "Not specified"

  const attributes: AttributeConfig[] = [
    { name: "Description", getValue: getDescription },
    { name: "Collection", getValue: getCollection },
    { name: "Material", getValue: getMaterial },
    { name: "Country of origin", getValue: getCountryOfOrigin },
    { name: "Type", getValue: getType },
    { name: "Weight", getValue: getWeight },
    { name: "Dimensions", getValue: getDimensions },
  ]

  return (
    <tbody>
      {attributes.map((attribute) => (
        <tr key={attribute.name}>
          <td className="p-4 border font-medium bg-gray-50">
            {attribute.name}
          </td>
          {products.map((product) => (
            <td key={product.id} className="p-4 border">
              {attribute.getValue(product)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default ComparedProductAttributes
