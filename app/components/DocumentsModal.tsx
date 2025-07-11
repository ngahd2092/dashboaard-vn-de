"use client"

import { useState } from "react"
import type { ProvinceData } from "../utils/demoData"

interface DocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  province: ProvinceData | null
}

export default function DocumentsModal({ isOpen, onClose, province }: DocumentsModalProps) {
  const [selectedType, setSelectedType] = useState<string>("all")

  if (!isOpen || !province) return null

  const getDocumentTypeInfo = (type: string) => {
    const types = {
      decision: { name: "Quyết định", icon: "fas fa-gavel", color: "blue" },
      circular: { name: "Thông tư", icon: "fas fa-file-circle-check", color: "green" },
      directive: { name: "Chỉ thị", icon: "fas fa-bullhorn", color: "purple" },
      plan: { name: "Kế hoạch", icon: "fas fa-calendar-alt", color: "orange" },
    }
    return types[type as keyof typeof types] || { name: type, icon: "fas fa-file", color: "gray" }
  }

  const getStatusInfo = (status: string) => {
    const statuses = {
      active: { name: "Hiệu lực", class: "bg-green-100 text-green-800", icon: "fas fa-check-circle" },
      draft: { name: "Dự thảo", class: "bg-yellow-100 text-yellow-800", icon: "fas fa-edit" },
      expired: { name: "Hết hiệu lực", class: "bg-red-100 text-red-800", icon: "fas fa-times-circle" },
    }
    return statuses[status as keyof typeof statuses] || statuses.active
  }

  const filteredDocuments =
    selectedType === "all" ? province.documents : province.documents.filter((doc) => doc.type === selectedType)

  const documentTypes = ["all", "decision", "circular", "directive", "plan"]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-file-alt text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold">Văn bản ban hành</h2>
                <p className="text-blue-100">{province.province}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {documentTypes.map((type) => {
              const isActive = selectedType === type
              const typeInfo = type === "all" ? { name: "Tất cả", icon: "fas fa-list" } : getDocumentTypeInfo(type)

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <i className={typeInfo.icon}></i>
                  <span>{typeInfo.name}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {type === "all"
                      ? province.documents.length
                      : province.documents.filter((d) => d.type === type).length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Documents List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-file-slash text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có văn bản</h3>
              <p className="text-gray-600">Không tìm thấy văn bản nào thuộc loại đã chọn.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => {
                const typeInfo = getDocumentTypeInfo(document.type)
                const statusInfo = getStatusInfo(document.status)

                return (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-full bg-${typeInfo.color}-100 flex items-center justify-center`}
                          >
                            <i className={`${typeInfo.icon} text-${typeInfo.color}-600 text-sm`}></i>
                          </div>
                          <div>
                            <span
                              className={`text-xs font-medium text-${typeInfo.color}-600 bg-${typeInfo.color}-100 px-2 py-1 rounded-full`}
                            >
                              {typeInfo.name}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{document.title}</h4>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-hashtag"></i>
                            <span>{document.number}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-calendar"></i>
                            <span>{new Date(document.date).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}
                          >
                            <i className={`${statusInfo.icon} mr-1`}></i>
                            {statusInfo.name}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                              <i className="fas fa-eye"></i>
                              <span>Xem</span>
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                              <i className="fas fa-download"></i>
                              <span>Tải về</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Hiển thị <span className="font-semibold">{filteredDocuments.length}</span> văn bản
              {selectedType !== "all" && (
                <span>
                  {" "}
                  thuộc loại <span className="font-semibold">{getDocumentTypeInfo(selectedType).name}</span>
                </span>
              )}
            </span>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                <i className="fas fa-plus"></i>
                <span>Thêm văn bản</span>
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
