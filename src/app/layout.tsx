import { ProvidersWrapper } from "@lib/providers/wrapper"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="bg-ui-bg-base text-ui-fg-base">
        <ProvidersWrapper>
          <main className="relative">{props.children}</main>
        </ProvidersWrapper>
      </body>
    </html>
  )
}
