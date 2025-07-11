"use client"

import { useMemo, useState } from "react"
import DocumentsModal from "./DocumentsModal"
import type { ProvinceData } from "../utils/demoData"

interface DataTableProps {
  data: ProvinceData[]
  originalData: ProvinceData[]
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: "province" | "total" | "id_vn" | "biz_vn"
  onSortChange: (sort: "province" | "total" | "id_vn" | "biz_vn") => void
  selectedRegion: "north" | "central" | "south" | null
  selectedProvinces: string[]
  viewMode: "all" | "region" | "selected"
  onRegionSelect: (region: "north" | "central" | "south" | null) => void
}

export default function DataTable({
  data,
  originalData,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedRegion,
  selectedProvinces,
  viewMode,
  onRegionSelect,
}: DataTableProps) {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalDomains = useMemo(() => originalData.reduce((sum, item) => sum + item.total, 0), [originalData])
  const maxIdVn = useMemo(() => Math.max(...originalData.map((item) => item.id_vn)), [originalData])
  const maxBizVn = useMemo(() => Math.max(...originalData.map((item) => item.biz_vn)), [originalData])

  const handleViewDocuments = (province: ProvinceData) => {
    setSelectedProvince(province)
    setIsModalOpen(true)
  }

  const getRegionName = (region: string) => {
    const regions = {
      north: "Miền Bắc",
      central: "Miền Trung",
      south: "Miền Nam",
    }
    return regions[region as keyof typeof regions] || ""
  }

  const getViewDescription = () => {
    switch (viewMode) {
      case "region":
        return getRegionName(selectedRegion || "")
      case "selected":
        return selectedProvinces.length > 0 ? `${selectedProvinces.length} tỉnh đã chọn` : "Chưa chọn tỉnh nào"
      default:
        return "Toàn quốc"
    }
  }

  const getBreadcrumb = () => {
    const items = [{ label: "Toàn quốc", icon: "fas fa-home", active: viewMode === "all" }]

    if (viewMode === "region" && selectedRegion) {
      items.push({
        label: getRegionName(selectedRegion),
        icon: "fas fa-map-marker-alt",
        active: true,
      })
    } else if (viewMode === "selected") {
      items.push({
        label: `${selectedProvinces.length} tỉnh đã chọn`,
        icon: "fas fa-check-square",
        active: true,
      })
    }

    return items
  }

  const getStatus = (total: number) => {
    if (total >= 1000) {
      return { text: "Cao", class: "bg-green-100 text-green-800", icon: "fas fa-arrow-up" }
    } else if (total >= 500) {
      return { text: "Trung bình", class: "bg-yellow-100 text-yellow-800", icon: "fas fa-minus" }
    } else {
      return { text: "Thấp", class: "bg-red-100 text-red-800", icon: "fas fa-arrow-down" }
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {getBreadcrumb().map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <i className="fas fa-chevron-right text-gray-400"></i>}
                  <span className={`flex items-center space-x-1 ${item.active ? "text-blue-600 font-medium" : ""}`}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết theo tỉnh thành
                  <span className="ml-2 text-sm font-normal text-gray-600">- {getViewDescription()}</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Hiển thị {data.length} tỉnh thành
                  {viewMode === "selected" && selectedProvinces.length > 0 && <span> đã chọn</span>}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`Tìm kiếm trong ${getViewDescription()}...`}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="province">Sắp xếp theo tỉnh</option>
                  <option value="total">Sắp xếp theo tổng</option>
                  <option value="id_vn">Sắp xếp theo ID.VN</option>
                  <option value="biz_vn">Sắp xếp theo BIZ.VN</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỉnh/Thành phố
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>ID.VN</span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>BIZ.VN</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Văn bản
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <i className="fas fa-search text-4xl mb-4"></i>
                      <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
                      <p className="text-sm">
                        {searchTerm
                          ? `Không có tỉnh nào phù hợp với "${searchTerm}" trong ${getViewDescription()}`
                          : `Không có dữ liệu cho ${getViewDescription()}`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const percentage = ((item.total / totalDomains) * 100).toFixed(1)
                  const status = getStatus(item.total)

                  return (
                    <tr key={item.stt} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <i className="fas fa-map-marker-alt text-gray-600 text-xs"></i>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{item.province}</div>
                            <div className="text-xs text-gray-500">{getRegionName(item.region)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{item.id_vn.toLocaleString()}</div>
                        <div className="w-full bg-blue-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(item.id_vn / maxIdVn) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{item.biz_vn.toLocaleString()}</div>
                        <div className="w-full bg-green-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: `${(item.biz_vn / maxBizVn) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{percentage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                        >
                          <i className={`${status.icon} mr-1`}></i>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDocuments(item)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                        >
                          <i className="fas fa-file-alt"></i>
                          <span>{item.documents.length} văn bản</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Hiển thị <span className="font-semibold">{data.length}</span> tỉnh thành
              {searchTerm && (
                <span>
                  {" "}
                  phù hợp với "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </span>
            <div className="flex items-center space-x-2">
              <span>Tổng cộng:</span>
              <span className="font-semibold">{totalDomains.toLocaleString()}</span>
              <span>tên miền</span>
            </div>
          </div>
        </div>
      </div>

      <DocumentsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} province={selectedProvince} />
    </>
  )
}
