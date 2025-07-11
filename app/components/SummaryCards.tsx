interface SummaryStats {
  totalIdVn: number
  totalBizVn: number
  totalProvinces: number
  totalDomains: number
}

interface SummaryCardsProps {
  stats: SummaryStats
  selectedRegion: "north" | "central" | "south" | null
  selectedProvinces: string[]
  viewMode: "all" | "region" | "selected"
}

export default function SummaryCards({ stats, selectedRegion, selectedProvinces, viewMode }: SummaryCardsProps) {
  const getViewDescription = () => {
    switch (viewMode) {
      case "region":
        const regions = {
          north: "Miền Bắc",
          central: "Miền Trung",
          south: "Miền Nam",
        }
        return regions[selectedRegion as keyof typeof regions] || "Toàn quốc"
      case "selected":
        return selectedProvinces.length > 0 ? `${selectedProvinces.length} tỉnh đã chọn` : "Chưa chọn tỉnh nào"
      default:
        return "Toàn quốc"
    }
  }

  const cards = [
    {
      title: "Tổng ID.VN",
      value: stats.totalIdVn,
      icon: "fas fa-globe",
      color: "blue",
      trend: "+12% so với tháng trước",
    },
    {
      title: "Tổng BIZ.VN",
      value: stats.totalBizVn,
      icon: "fas fa-building",
      color: "green",
      trend: "+8% so với tháng trước",
    },
    {
      title: viewMode === "selected" ? "Số tỉnh đã chọn" : "Số tỉnh triển khai",
      value: stats.totalProvinces,
      icon: "fas fa-map-marker-alt",
      color: "purple",
      trend: getViewDescription(),
    },
    {
      title: "Tổng tên miền",
      value: stats.totalDomains,
      icon: "fas fa-chart-line",
      color: "orange",
      trend: "+10% so với tháng trước",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-4">
      {(viewMode === "region" || viewMode === "selected") && (
        <div
          className={`bg-gradient-to-r ${
            viewMode === "region" ? "from-blue-500 to-purple-600" : "from-green-500 to-blue-600"
          } text-white rounded-lg p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className={`fas ${viewMode === "region" ? "fa-map" : "fa-check-square"} text-xl`}></i>
              <div>
                <h3 className="font-semibold">
                  {viewMode === "region" ? "Đang xem theo vùng miền" : "Đang xem tỉnh đã chọn"}
                </h3>
                <p className="text-blue-100 text-sm">
                  {viewMode === "region"
                    ? `Dữ liệu của ${getViewDescription()}`
                    : selectedProvinces.length > 0
                      ? `${selectedProvinces.slice(0, 2).join(", ")}${selectedProvinces.length > 2 ? ` và ${selectedProvinces.length - 2} tỉnh khác` : ""}`
                      : "Chưa chọn tỉnh nào để hiển thị"}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.totalProvinces} tỉnh</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center relative ${getColorClasses(card.color)}`}
                >
                  <i className={`${card.icon} text-xl`}></i>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <i className="fas fa-chart-line text-xs text-gray-600"></i>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  <i className="fas fa-arrow-up"></i> {card.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
