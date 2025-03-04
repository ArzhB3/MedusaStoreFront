import { retrieveCompare } from "@lib/data/compare"
import CompareDropdown from "../compare-dropdown"

export default async function CompareButton() {
    const compare = await retrieveCompare().catch(() => null)
  
    return <CompareDropdown compare={compare} />
}