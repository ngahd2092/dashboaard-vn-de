"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, MapPin, Users, Filter } from "lucide-react"
import type { ProvinceData } from "../utils/demoData"

interface ProvinceSelectorProps {
  provinces: ProvinceData[]
  selectedProvinces: string[]
  onProvinceSelect: (provinces: string[]) => void
  viewMode: "all" | "region" | "selected"
  onViewModeChange: (mode: "all" | "region" | "selected") => void
  selectedRegion: "north" | "central" | "south" | null
}

const regionNames = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
}

const regionColors = {
  north: "bg-blue-100 text-blue-800 border-blue-200",
  central: "bg-green-100 text-green-800 border-green-200",
  south: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function ProvinceSelector({
  provinces,
  selectedProvinces,
  onProvinceSelect,
  viewMode,
  onViewModeChange,
  selectedRegion,
}: ProvinceSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Group provinces by region
  const provincesByRegion = useMemo(() => {
    const grouped = provinces.reduce(
      (acc, province) => {
        if (!acc[province.region]) {
          acc[province.region] = []
        }
        acc[province.region].push(province)
        return acc
      },
      {} as Record<string, ProvinceData[]>,
    )

    // Sort provinces within each region
    Object.keys(grouped).forEach((region) => {
      grouped[region].sort((a, b) => a.province.localeCompare(b.province))
    })

    return grouped
  }, [provinces])

  // Filter provinces based on search term
  const filteredProvinces = useMemo(() => {
    if (!searchTerm) return provincesByRegion

    const filtered: Record<string, ProvinceData[]> = {}
    Object.entries(provincesByRegion).forEach(([region, provinceList]) => {
      const matchingProvinces = provinceList.filter((province) =>
        province.province.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (matchingProvinces.length > 0) {
        filtered[region] = matchingProvinces
      }
    })
    return filtered
  }, [provincesByRegion, searchTerm])

  // Calculate selection stats
  const selectionStats = useMemo(() => {
    const totalProvinces = provinces.length
    const selectedCount = selectedProvinces.length
    const percentage = totalProvinces > 0 ? Math.round((selectedCount / totalProvinces) * 100) : 0

    return { totalProvinces, selectedCount, percentage }
  }, [provinces.length, selectedProvinces.length])

  // Handle individual province selection
  const handleProvinceToggle = (provinceName: string) => {
    const newSelection = selectedProvinces.includes(provinceName)
      ? selectedProvinces.filter((p) => p !== provinceName)
      : [...selectedProvinces, provinceName]

    onProvinceSelect(newSelection)
  }

  // Handle region selection (select/deselect all provinces in region)
  const handleRegionToggle = (region: string) => {
    const regionProvinces = provincesByRegion[region]?.map((p) => p.province) || []
    const allSelected = regionProvinces.every((p) => selectedProvinces.includes(p))

    let newSelection: string[]
    if (allSelected) {
      // Deselect all provinces in this region
      newSelection = selectedProvinces.filter((p) => !regionProvinces.includes(p))
    } else {
      // Select all provinces in this region
      const provincesToAdd = regionProvinces.filter((p) => !selectedProvinces.includes(p))
      newSelection = [...selectedProvinces, ...provincesToAdd]
    }

    onProvinceSelect(newSelection)
  }

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedProvinces.length === provinces.length) {
      onProvinceSelect([])
    } else {
      onProvinceSelect(provinces.map((p) => p.province))
    }
  }

  // Get region selection state
  const getRegionSelectionState = (region: string) => {
    const regionProvinces = provincesByRegion[region]?.map((p) => p.province) || []
    const selectedInRegion = regionProvinces.filter((p) => selectedProvinces.includes(p)).length

    if (selectedInRegion === 0) return "none"
    if (selectedInRegion === regionProvinces.length) return "all"
    return "partial"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chọn tỉnh/thành phố</h3>
              <p className="text-sm text-gray-500">Lọc dữ liệu theo vùng miền hoặc tỉnh thành cụ thể</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {viewMode === "selected" && selectedProvinces.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedProvinces.length} đã chọn
              </span>
            )}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange("all")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Tất cả</span>
            </div>
          </button>
          <button
            onClick={() => onViewModeChange("region")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === "region"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Theo vùng</span>
            </div>
          </button>
          <button
            onClick={() => onViewModeChange("selected")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === "selected"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Tùy chọn</span>
            </div>
          </button>
        </div>

        {/* Current Selection Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {viewMode === "all" && "Hiển thị tất cả 34 tỉnh/thành phố"}
              {viewMode === "region" && selectedRegion && (
                <span>
                  Hiển thị vùng{" "}
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${regionColors[selectedRegion]}`}
                  >
                    {regionNames[selectedRegion]}
                  </span>
                </span>
              )}
              {viewMode === "selected" && (
                <span>
                  Đã chọn {selectedProvinces.length}/{provinces.length} tỉnh/thành phố
                </span>
              )}
            </div>
            {viewMode === "selected" && (
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectionStats.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{selectionStats.percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Selection Panel */}
      {viewMode === "selected" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Chọn tỉnh/thành phố</h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tỉnh/thành phố..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Select All/None */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedProvinces.length === provinces.length}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = selectedProvinces.length > 0 && selectedProvinces.length < provinces.length
                      }
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Tất cả tỉnh/thành phố</span>
                </label>
                <span className="text-xs text-gray-500">
                  {selectedProvinces.length}/{provinces.length}
                </span>
              </div>

              {/* Provinces by Region */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(filteredProvinces).map(([region, regionProvinces]) => {
                  const selectionState = getRegionSelectionState(region)
                  return (
                    <div key={region} className="space-y-2">
                      {/* Region Header */}
                      <div className="flex items-center justify-between py-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectionState === "all"}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = selectionState === "partial"
                              }
                            }}
                            onChange={() => handleRegionToggle(region)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${regionColors[region as keyof typeof regionColors]}`}
                          >
                            {regionNames[region as keyof typeof regionNames]}
                          </span>
                        </label>
                        <span className="text-xs text-gray-500">
                          {regionProvinces.filter((p) => selectedProvinces.includes(p.province)).length}/
                          {regionProvinces.length}
                        </span>
                      </div>

                      {/* Provinces in Region */}
                      <div className="ml-6 space-y-1">
                        {regionProvinces.map((province) => (
                          <label key={province.province} className="flex items-center space-x-3 py-1">
                            <input
                              type="checkbox"
                              checked={selectedProvinces.includes(province.province)}
                              onChange={() => handleProvinceToggle(province.province)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{province.province}</span>
                            <span className="text-xs text-gray-500">({province.total.toLocaleString()})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
