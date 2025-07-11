"use client"

import { useState } from "react"

interface DebugPanelProps {
  data: any[]
  originalData: any[]
}

export default function DebugPanel({ data, originalData }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700"
      >
        <i className="fas fa-bug"></i>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Debug Info</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <strong>Data Length:</strong> {data.length}
            </div>
            <div>
              <strong>Original Data Length:</strong> {originalData.length}
            </div>
            <div>
              <strong>First Province:</strong> {data[0]?.province || "N/A"}
            </div>
            <div>
              <strong>Total Domains:</strong> {data.reduce((sum, item) => sum + (item.total || 0), 0)}
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer font-medium">Raw Data (First 3)</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(data.slice(0, 3), null, 2)}
              </pre>
            </details>

            <button
              onClick={() => {
                console.log("Full data:", data)
                console.log("Original data:", originalData)
              }}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
            >
              Log to Console
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
