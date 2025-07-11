"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import RegionalStats from "./components/RegionalStats"
import Charts from "./components/Charts"
import DataTable from "./components/DataTable"
import DemoNotice from "./components/DemoNotice"
import LoadingState from "./components/LoadingState"
import ProvinceSelector from "./components/ProvinceSelector"
import CommonDocumentsModal from "./components/CommonDocumentsModal"
import {
  generateDemoData,
  generateCommonDocuments,
  type ProvinceData,
  type DocumentData,
  type CommonDocumentData,
} from "./utils/demoData"
import DebugPanel from "./components/DebugPanel"
import DataCheck from "./components/DataCheck"

export default function DashboardPage() {
  // Fallback data in case of issues
  const fallbackData: ProvinceData[] = [
    {
      stt: 1,
      province: "Hà Nội",
      region: "north" as const,
      id_vn: 2200,
      biz_vn: 1600,
      total: 3800,
      documents: [],
    },
    {
      stt: 2,
      province: "TP. Hồ Chí Minh",
      region: "south" as const,
      id_vn: 2500,
      biz_vn: 1800,
      total: 4300,
      documents: [],
    },
  ]

  const [data, setData] = useState<ProvinceData[]>([])
  const [originalData, setOriginalData] = useState<ProvinceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"province" | "total" | "id_vn" | "biz_vn">("province")
  const [selectedRegion, setSelectedRegion] = useState<"north" | "central" | "south" | null>(null)
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"all" | "region" | "selected">("all")
  const [error, setError] = useState<string | null>(null)
  const [hasDataIssue, setHasDataIssue] = useState(false)
  const [commonDocuments, setCommonDocuments] = useState<CommonDocumentData[]>([])
  const [showCommonDocuments, setShowCommonDocuments] = useState(false)

  // Initialize data
  useEffect(() => {
    console.log("Initializing data...")
    try {
      const initData = generateDemoData()
      const initCommonDocs = generateCommonDocuments()
      console.log("Generated data length:", initData?.length)
      console.log("Generated common documents:", initCommonDocs?.length)

      if (initData && initData.length > 0) {
        setOriginalData(initData)
        setData(initData)
        console.log("Data loaded successfully:", initData.length, "provinces")
      } else {
        console.warn("Using fallback data")
        setOriginalData(fallbackData)
        setData(fallbackData)
      }

      if (initCommonDocs && initCommonDocs.length > 0) {
        setCommonDocuments(initCommonDocs)
        console.log("Common documents loaded successfully:", initCommonDocs.length, "documents")
      }
    } catch (error) {
      console.error("Error generating data:", error)
      setOriginalData(fallbackData)
      setData(fallbackData)
    }

    setLastUpdate(new Date())

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  // Filter data based on view mode
  const filteredData = useMemo(() => {
    switch (viewMode) {
      case "region":
        return selectedRegion ? data.filter((item) => item.region === selectedRegion) : data
      case "selected":
        return selectedProvinces.length > 0 ? data.filter((item) => selectedProvinces.includes(item.province)) : data
      default:
        return data
    }
  }, [data, selectedRegion, selectedProvinces, viewMode])

  // Refresh data with random variations
  const refreshData = useCallback(() => {
    setIsLoading(true)

    setTimeout(() => {
      const newData = originalData
        .map((item) => ({
          ...item,
          id_vn: Math.max(0, item.id_vn + Math.floor(Math.random() * 20) - 10),
          biz_vn: Math.max(0, item.biz_vn + Math.floor(Math.random() * 15) - 7),
        }))
        .map((item) => ({
          ...item,
          total: item.id_vn + item.biz_vn,
        }))

      setData(newData)
      setLastUpdate(new Date())
      setIsLoading(false)
    }, 1500)
  }, [originalData])

  // Handle region selection
  const handleRegionSelect = useCallback((region: "north" | "central" | "south" | null) => {
    setSelectedRegion(region)
    setViewMode(region ? "region" : "all")
    setSearchTerm("")
    setSelectedProvinces([])
  }, [])

  // Handle province selection
  const handleProvinceSelect = useCallback((provinces: string[]) => {
    setSelectedProvinces(provinces)
    setViewMode(provinces.length > 0 ? "selected" : "all")
    setSelectedRegion(null)
    setSearchTerm("")
  }, [])

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: "all" | "region" | "selected") => {
    setViewMode(mode)
    if (mode === "all") {
      setSelectedRegion(null)
      setSelectedProvinces([])
    }
    setSearchTerm("")
  }, [])

  const handleAddDocumentToProvince = useCallback(
    (provinceIndex: number, document: Omit<DocumentData, "id">) => {
      const newDocument: DocumentData = {
        ...document,
        id: `${data[provinceIndex].province}-${Date.now()}`,
      }

      const newData = [...data]
      newData[provinceIndex] = {
        ...newData[provinceIndex],
        documents: [...newData[provinceIndex].documents, newDocument],
      }

      setData(newData)
      console.log("Added document to province:", newDocument)
    },
    [data],
  )

  const handleAddCommonDocument = useCallback((document: Omit<CommonDocumentData, "id">) => {
    const newDocument: CommonDocumentData = {
      ...document,
      id: `common-${Date.now()}`,
      fileSize: "1.2 MB",
      downloadCount: 0,
    }

    setCommonDocuments((prev) => [...prev, newDocument])
    console.log("Added common document:", newDocument)
  }, [])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = filteredData.filter((item) => item.province.toLowerCase().includes(searchTerm.toLowerCase()))

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "province":
          return a.province.localeCompare(b.province)
        case "total":
          return b.total - a.total
        case "id_vn":
          return b.id_vn - a.id_vn
        case "biz_vn":
          return b.biz_vn - a.biz_vn
        default:
          return 0
      }
    })

    return sorted
  }, [filteredData, searchTerm, sortBy])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalIdVn = filteredData.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = filteredData.reduce((sum, item) => sum + item.biz_vn, 0)
    const totalProvinces = filteredData.length
    const totalDomains = totalIdVn + totalBizVn

    return {
      totalIdVn,
      totalBizVn,
      totalProvinces,
      totalDomains,
    }
  }, [filteredData])

  // Calculate regional statistics (always show all regions)
  const regionalStats = useMemo(() => {
    const regions = {
      north: data.filter((item) => item.region === "north").reduce((sum, item) => sum + item.total, 0),
      central: data.filter((item) => item.region === "central").reduce((sum, item) => sum + item.total, 0),
      south: data.filter((item) => item.region === "south").reduce((sum, item) => sum + item.total, 0),
    }
    return regions
  }, [data])

  // Handle data issues
  const handleDataIssue = useCallback(() => {
    setHasDataIssue(true)
    console.error("Data issue detected!")
  }, [])

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingState />
  }

  // Check if no data loaded
  if (!isLoading && data.length === 0) {
    console.error("No data loaded!")
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải dữ liệu demo</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header
        onRefresh={refreshData}
        lastUpdate={lastUpdate}
        onShowCommonDocuments={() => setShowCommonDocuments(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DemoNotice />
        <DataCheck data={data} onDataIssue={handleDataIssue} />

        {hasDataIssue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-600 mr-3"></i>
              <div>
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-sm text-red-700 mt-1">
                  Không thể tải dữ liệu demo. Vui lòng kiểm tra console để xem chi tiết lỗi.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Tải lại trang
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Province Selector */}
          <ProvinceSelector
            provinces={data}
            selectedProvinces={selectedProvinces}
            onProvinceSelect={handleProvinceSelect}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            selectedRegion={selectedRegion}
          />

          <SummaryCards
            stats={summaryStats}
            selectedRegion={selectedRegion}
            selectedProvinces={selectedProvinces}
            viewMode={viewMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Charts data={filteredData} />
          </div>

          <RegionalStats stats={regionalStats} selectedRegion={selectedRegion} onRegionSelect={handleRegionSelect} />

          <DataTable
            data={filteredAndSortedData}
            originalData={filteredData}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedRegion={selectedRegion}
            selectedProvinces={selectedProvinces}
            viewMode={viewMode}
            onRegionSelect={handleRegionSelect}
            onAddDocument={handleAddDocumentToProvince}
          />
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">© 2024 Dashboard Triển Khai Tên Miền. Phiên bản Demo.</div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Được xây dựng với</span>
              <i className="fas fa-heart text-red-500"></i>
              <span className="text-sm text-gray-500">bởi React & v0</span>
            </div>
          </div>
        </div>
      </footer>
      <DebugPanel data={data} originalData={originalData} />
      <CommonDocumentsModal
        isOpen={showCommonDocuments}
        onClose={() => setShowCommonDocuments(false)}
        documents={commonDocuments}
        onAddDocument={handleAddCommonDocument}
      />
    </div>
  )
}
