"use client"

import { useState } from "react"
import type { ProvinceData } from "../utils/demoData"

interface DebugPanelProps {
  data: ProvinceData[]
  originalData?: ProvinceData[]
}

export default function DebugPanel({ data, originalData }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null
  }

  const logToConsole = () => {
    console.log("=== DEBUG INFO ===")
    console.log("Current data:", data)
    console.log("Original data:", originalData)
    console.log("Data length:", data.length)
    console.log("Sample item:", data[0])
    console.log("==================")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
      >
        Debug ({data.length})
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Debug Panel</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <strong>Data Length:</strong> {data.length}
            </div>

            <div>
              <strong>Original Data Length:</strong> {originalData?.length || 0}
            </div>

            <div>
              <strong>Sample Data:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {JSON.stringify(data.slice(0, 2), null, 2)}
              </pre>
            </div>

            <button
              onClick={logToConsole}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
            >
              Log to Console
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
