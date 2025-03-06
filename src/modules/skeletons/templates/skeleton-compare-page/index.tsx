import repeat from "@lib/util/repeat"
import SkeletonCompareProductCard from "@modules/skeletons/components/skeleton-compare-product-card"

const SkeletonComparePage = () => {
  return (
    <div className="py-6">
      <div className="content-container">
        <div className="h-8 w-48 bg-gray-100 mb-8 animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repeat(3).map((_, index) => (
            <SkeletonCompareProductCard key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonComparePage
