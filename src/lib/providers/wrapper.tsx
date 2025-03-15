import { CompareProvider } from "@lib/context/compare-context"

import { Toaster, TooltipProvider } from "@medusajs/ui"

import { ThemeProvider } from "./theme"

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CompareProvider>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </CompareProvider>
    </ThemeProvider>
  )
}
