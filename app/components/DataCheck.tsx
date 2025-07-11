"use client"

import { useEffect } from "react"
import type { ProvinceData } from "../utils/demoData"

interface DataCheckProps {
  data: ProvinceData[]
  onDataIssue?: () => void
}

export default function DataCheck({ data, onDataIssue }: DataCheckProps) {
  useEffect(() => {
    console.log("DataCheck - Current data:", data)
    console.log("DataCheck - Data length:", data.length)

    if (data.length === 0) {
      console.error("DataCheck - No data available!")
      onDataIssue?.()
    } else {
      console.log("DataCheck - Data is valid")
      // Log first few items for verification
      console.log("DataCheck - Sample data:", data.slice(0, 3))
    }
  }, [data, onDataIssue])

  // This component doesn't render anything visible
  return null
}
