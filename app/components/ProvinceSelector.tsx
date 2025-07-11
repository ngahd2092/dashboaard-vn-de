"use client"

import { useState, useMemo } from "react"
import type { ProvinceData } from "../utils/demoData"

interface ProvinceSelectorProps {
  provinces: ProvinceData[]
  selectedProvinces: string[]
  onProvinceSelect: (provinces: string[]) => void
  viewMode: "all" | "region" | "selected"
  onViewModeChange: (mode: "all" | "region" | "selected") => void
  selectedRegion: "north" | "central" | "south" | null
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

  // Filter provinces based on search
  const filteredProvinces = useMemo(() => {
    if (!searchTerm) return provincesByRegion

    const filtered: Record<string, ProvinceData[]> = {}
    Object.keys(provincesByRegion).forEach((region) => {
      const regionProvinces = provincesByRegion[region].filter((province) =>
        province.province.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (regionProvinces.length > 0) {
        filtered[region] = regionProvinces
      }
    })
    return filtered
  }, [provincesByRegion, searchTerm])

  const handleProvinceToggle = (provinceName: string) => {
    const newSelected = selectedProvinces.includes(provinceName)
      ? selectedProvinces.filter((p) => p !== provinceName)
      : [...selectedProvinces, provinceName]

    onProvinceSelect(newSelected)
  }

  const handleSelectAll = () => {
    onProvinceSelect(provinces.map((p) => p.province))
  }

  const handleClearAll = () => {
    onProvinceSelect([])
  }

  const getRegionName = (region: string) => {
    const regions = {
      north: "Miền Bắc",
      central: "Miền Trung",
      south: "Miền Nam",
    }
    return regions[region as keyof typeof regions] || region
  }

  const getRegionIcon = (region: string) => {
    const icons = {
      north: "fas fa-mountain",
      central: "fas fa-water",
      south: "fas fa-sun",
    }
    return icons[region as keyof typeof icons] || "fas fa-map-marker-alt"
  }

  const getViewModeInfo = () => {
    switch (viewMode) {
      case "region":
        return {
          title: `Đang xem: ${getRegionName(selectedRegion || "")}`,
          subtitle: `${provinces.filter((p) => p.region === selectedRegion).length} tỉnh thành`,
          color: "blue",
        }
      case "selected":
        return {
          title: `Đã chọn: ${selectedProvinces.length} tỉnh thành`,
          subtitle:
            selectedProvinces.length > 0
              ? selectedProvinces.slice(0, 3).join(", ") + (selectedProvinces.length > 3 ? "..." : "")
              : "Chưa chọn tỉnh nào",
          color: "green",
        }
      default:
        return {
          title: "Hiển thị tất cả",
          subtitle: `${provinces.length} tỉnh thành toàn quốc`,
          color: "gray",
        }
    }
  }

  const viewInfo = getViewModeInfo()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-filter text-blue-600 text-xl"></i>
            <h3 className="text-lg font-semibold text-gray-900">Chọn tỉnh thành hiển thị</h3>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-globe mr-1"></i>
              Tất cả
            </button>
            <button
              onClick={() => onViewModeChange("region")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "region" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-map mr-1"></i>
              Theo vùng
            </button>
            <button
              onClick={() => onViewModeChange("selected")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "selected" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-check-square mr-1"></i>
              Tùy chọn
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "selected" && (
            <>
              <button onClick={handleSelectAll} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Chọn tất cả
              </button>
              <button onClick={handleClearAll} className="text-red-600 hover:text-red-800 text-sm font-medium">
                Bỏ chọn
              </button>
            </>
          )}

          {viewMode === "selected" && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <i className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Current View Info */}
      <div className={`bg-${viewInfo.color}-50 border border-${viewInfo.color}-200 rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${viewInfo.color}-100 rounded-full flex items-center justify-center`}>
              <i className={`fas fa-eye text-${viewInfo.color}-600`}></i>
            </div>
            <div>
              <h4 className={`font-semibold text-${viewInfo.color}-900`}>{viewInfo.title}</h4>
              <p className={`text-sm text-${viewInfo.color}-700`}>{viewInfo.subtitle}</p>
            </div>
          </div>

          {(viewMode === "region" || viewMode === "selected") && (
            <button
              onClick={() => onViewModeChange("all")}
              className={`text-${viewInfo.color}-600 hover:text-${viewInfo.color}-800 text-sm font-medium flex items-center space-x-1`}
            >
              <i className="fas fa-times"></i>
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Province Selection (only show when in selected mode and expanded) */}
      {viewMode === "selected" && isExpanded && (
        <div className="border-t border-gray-200 pt-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm tỉnh thành..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Selected Count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Đã chọn: <span className="font-semibold text-blue-600">{selectedProvinces.length}</span> /{" "}
              {provinces.length} tỉnh thành
            </span>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedProvinces.length / provinces.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Province List by Region */}
          <div className="space-y-6">
            {Object.keys(filteredProvinces).map((region) => (
              <div key={region} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className={`${getRegionIcon(region)} text-gray-600`}></i>
                    <h4 className="font-semibold text-gray-900">{getRegionName(region)}</h4>
                    <span className="text-sm text-gray-500">
                      ({filteredProvinces[region].filter((p) => selectedProvinces.includes(p.province)).length}/
                      {filteredProvinces[region].length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const regionProvinces = filteredProvinces[region].map((p) => p.province)
                      const allSelected = regionProvinces.every((p) => selectedProvinces.includes(p))

                      if (allSelected) {
                        onProvinceSelect(selectedProvinces.filter((p) => !regionProvinces.includes(p)))
                      } else {
                        onProvinceSelect([...new Set([...selectedProvinces, ...regionProvinces])])
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {filteredProvinces[region].every((p) => selectedProvinces.includes(p.province))
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredProvinces[region].map((province) => (
                    <label
                      key={province.province}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProvinces.includes(province.province)}
                        onChange={() => handleProvinceToggle(province.province)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{province.province}</span>
                      <span className="text-xs text-gray-500">({province.total.toLocaleString()})</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
