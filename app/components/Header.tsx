"use client"

interface HeaderProps {
  onRefresh: () => void
  lastUpdate: Date | null
}

export default function Header({ onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-globe text-blue-600 text-2xl"></i>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Triển Khai Tên Miền</h1>
              <span className="demo-badge bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                DEMO
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <i className="fas fa-sync-alt"></i>
              <span>Làm mới dữ liệu</span>
            </button>
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối:{" "}
              <span className="font-medium">{lastUpdate ? lastUpdate.toLocaleString("vi-VN") : "--"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
