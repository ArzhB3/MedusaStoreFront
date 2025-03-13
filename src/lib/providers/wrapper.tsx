import { CompareProvider } from "@lib/context/compare-context"
import { Toaster, TooltipProvider } from "@medusajs/ui"

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </CompareProvider>
  )
}
