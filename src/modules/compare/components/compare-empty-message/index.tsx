import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const CompareEmptyMessage = () => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="compare-empty-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Compare
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Sorry, there are nothing to compare here. Please go back to the store
        and add at least two products to compare.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default CompareEmptyMessage
