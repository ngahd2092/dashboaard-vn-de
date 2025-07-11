"use client"

import { useEffect } from "react"

interface DataCheckProps {
  data: any[]
  onDataIssue: () => void
}

export default function DataCheck({ data, onDataIssue }: DataCheckProps) {
  useEffect(() => {
    console.log("DataCheck - Current data:", data)

    if (data.length === 0) {
      console.warn("DataCheck - No data found!")
      onDataIssue()
    } else {
      console.log("DataCheck - Data OK, length:", data.length)
    }
  }, [data, onDataIssue])

  return null // This component doesn't render anything
}
