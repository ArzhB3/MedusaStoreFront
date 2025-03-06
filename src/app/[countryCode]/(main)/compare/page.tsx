import { Metadata } from "next"
import CompareTemplate from "@modules/compare/templates"

export const metadata: Metadata = {
  title: "Compare Products",
  description:
    "Compare products side by side to make an informed decision on your purchase",
}

export default async function ComparePage() {
  return <CompareTemplate />
}
