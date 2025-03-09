import { Prompt } from "@medusajs/ui"

type RemoveProductPromptProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

const RemoveProductPrompt = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
}: RemoveProductPromptProps) => {
  return (
    <Prompt variant="confirmation" open={isOpen} onOpenChange={onOpenChange}>
      <Prompt.Content className="rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200 origin-center">
        <Prompt.Header>
          <Prompt.Title className="text-lg font-medium">
            Remove product from comparison
          </Prompt.Title>
          <Prompt.Description className="text-ui-fg-subtle mt-2 text-justify">
            Since product comparison requires at least two products, removing
            this item will return you to the store with your remaining
            selection.
          </Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer className="flex justify-between">
          <Prompt.Cancel
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-300 text-gray-800 transition-colors duration-200 border-0 px-4 py-2 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-none"
          >
            Cancel
          </Prompt.Cancel>
          <Prompt.Action
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-800 text-white transition-colors duration-200 px-4 py-2 rounded-md font-medium border-0 outline-none focus:outline-none focus:ring-2 focus:ring-red-400 shadow-none"
          >
            Remove and go to store
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  )
}

export default RemoveProductPrompt
