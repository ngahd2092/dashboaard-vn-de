"use client"

import { useState } from "react"
import { X, Download, Eye, Plus, Search } from "lucide-react"
import type { CommonDocumentData } from "../utils/demoData"

interface CommonDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  documents: CommonDocumentData[]
  onAddDocument?: (document: Omit<CommonDocumentData, "id">) => void
}

export default function CommonDocumentsModal({ isOpen, onClose, documents, onAddDocument }: CommonDocumentsModalProps) {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDocument, setNewDocument] = useState({
    title: "",
    type: "decision" as const,
    number: "",
    date: "",
    status: "active" as const,
    description: "",
  })

  if (!isOpen) return null

  const getDocumentTypeInfo = (type: string) => {
    const types = {
      decision: { name: "Quyết định", icon: "fas fa-gavel", color: "blue" },
      circular: { name: "Thông tư", icon: "fas fa-file-circle-check", color: "green" },
      directive: { name: "Chỉ thị", icon: "fas fa-bullhorn", color: "purple" },
      plan: { name: "Kế hoạch", icon: "fas fa-calendar-alt", color: "orange" },
      guideline: { name: "Hướng dẫn", icon: "fas fa-book", color: "indigo" },
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

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = selectedType === "all" || doc.type === selectedType
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const documentTypes = ["all", "decision", "circular", "directive", "plan", "guideline"]

  const handleAddDocument = () => {
    if (onAddDocument && newDocument.title && newDocument.number) {
      onAddDocument({
        ...newDocument,
        date: newDocument.date || new Date().toISOString().split("T")[0],
      })
      setNewDocument({
        title: "",
        type: "decision",
        number: "",
        date: "",
        status: "active",
        description: "",
      })
      setShowAddForm(false)
    }
  }

  const handleDownload = (document: CommonDocumentData) => {
    // Simulate download
    console.log("Downloading document:", document.title)
    // In real implementation, this would trigger actual file download
    alert(`Đang tải xuống: ${document.title}`)
  }

  const handleView = (document: CommonDocumentData) => {
    // Simulate view
    console.log("Viewing document:", document.title)
    // In real implementation, this would open document viewer
    alert(`Đang xem: ${document.title}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-folder-open text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold">Văn bản chung</h2>
                <p className="text-blue-100">Tài liệu hướng dẫn và quy định chung</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm văn bản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Add Document Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm văn bản</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto py-4 mt-4">
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
                    {type === "all" ? documents.length : documents.filter((d) => d.type === type).length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Add Document Form */}
        {showAddForm && (
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm văn bản mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề văn bản..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số văn bản</label>
                <input
                  type="text"
                  value={newDocument.number}
                  onChange={(e) => setNewDocument({ ...newDocument, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: 123/QĐ-BTTTT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại văn bản</label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="decision">Quyết định</option>
                  <option value="circular">Thông tư</option>
                  <option value="directive">Chỉ thị</option>
                  <option value="plan">Kế hoạch</option>
                  <option value="guideline">Hướng dẫn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ban hành</label>
                <input
                  type="date"
                  value={newDocument.date}
                  onChange={(e) => setNewDocument({ ...newDocument, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả ngắn gọn về nội dung văn bản..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Thêm văn bản
              </button>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-file-slash text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có văn bản</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `Không tìm thấy văn bản nào phù hợp với "${searchTerm}"`
                  : "Chưa có văn bản nào được thêm."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDocuments.map((document) => {
                const typeInfo = getDocumentTypeInfo(document.type)
                const statusInfo = getStatusInfo(document.status)

                return (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-${typeInfo.color}-100 flex items-center justify-center`}
                        >
                          <i className={`${typeInfo.icon} text-${typeInfo.color}-600`}></i>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-medium text-${typeInfo.color}-600 bg-${typeInfo.color}-100 px-2 py-1 rounded-full`}
                          >
                            {typeInfo.name}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}
                      >
                        <i className={`${statusInfo.icon} mr-1`}></i>
                        {statusInfo.name}
                      </span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{document.title}</h4>

                    {document.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-hashtag"></i>
                        <span>{document.number}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-calendar"></i>
                        <span>{new Date(document.date).toLocaleDateString("vi-VN")}</span>
                      </div>
                      {document.fileSize && (
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-file"></i>
                          <span>{document.fileSize}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {document.downloadCount && (
                          <span>
                            <i className="fas fa-download mr-1"></i>
                            {document.downloadCount.toLocaleString()} lượt tải
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(document)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Xem</span>
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Tải về</span>
                        </button>
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
  )
}
