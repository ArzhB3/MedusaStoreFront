import { CompareProvider } from "@lib/context/compare-context"
import { Toaster, TooltipProvider } from "@medusajs/ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </CompareProvider>
  )
}
