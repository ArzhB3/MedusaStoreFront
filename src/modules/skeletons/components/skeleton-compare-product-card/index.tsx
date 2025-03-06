import React from "react"

const SkeletonCompareProductCard = () => {
  return (
    <div className="bg-white p-4 rounded border border-gray-200 animate-pulse">
      <div className="aspect-square w-full bg-gray-100 mb-4" />

      <div className="h-4 w-2/3 bg-gray-100 mb-3" />

      <div className="h-3 w-1/2 bg-gray-100 mb-3" />

      <div className="flex flex-col gap-1.5 mb-3">
        <div className="h-2.5 w-full bg-gray-100" />
        <div className="h-2.5 w-full bg-gray-100" />
        <div className="h-2.5 w-3/4 bg-gray-100" />
      </div>

      <div className="mt-2 flex gap-2">
        <div className="h-2.5 w-10 bg-gray-100" />
        <div className="h-2.5 w-16 bg-gray-100" />
        <div className="h-2.5 w-12 bg-gray-100" />
      </div>
    </div>
  )
}

export default SkeletonCompareProductCard
