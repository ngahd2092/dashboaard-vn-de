import { Chart } from "@/components/ui/chart"
class DomainDashboardDemo {
  constructor() {
    this.data = []
    this.charts = {}
    this.originalData = []
    this.init()
  }

  init() {
    this.generateDemoData()
    this.setupEventListeners()
    this.renderDashboard()
    this.updateLastUpdateTime()
  }

  generateDemoData() {
    // Dữ liệu mẫu cho các tỉnh thành Việt Nam
    const provinces = [
      { name: "TP. Hồ Chí Minh", region: "south", id_vn: 2500, biz_vn: 1800 },
      { name: "Hà Nội", region: "north", id_vn: 2200, biz_vn: 1600 },
      { name: "Đà Nẵng", region: "central", id_vn: 800, biz_vn: 600 },
      { name: "Hải Phòng", region: "north", id_vn: 650, biz_vn: 480 },
      { name: "Cần Thơ", region: "south", id_vn: 580, biz_vn: 420 },
      { name: "Biên Hòa", region: "south", id_vn: 520, biz_vn: 380 },
      { name: "Huế", region: "central", id_vn: 450, biz_vn: 320 },
      { name: "Nha Trang", region: "central", id_vn: 420, biz_vn: 300 },
      { name: "Buôn Ma Thuột", region: "central", id_vn: 380, biz_vn: 280 },
      { name: "Quy Nhon", region: "central", id_vn: 350, biz_vn: 250 },
      { name: "Thái Nguyên", region: "north", id_vn: 320, biz_vn: 240 },
      { name: "Thanh Hóa", region: "central", id_vn: 310, biz_vn: 230 },
      { name: "Nghệ An", region: "central", id_vn: 300, biz_vn: 220 },
      { name: "Long Xuyên", region: "south", id_vn: 290, biz_vn: 210 },
      { name: "Hạ Long", region: "north", id_vn: 280, biz_vn: 200 },
      { name: "Nam Định", region: "north", id_vn: 270, biz_vn: 190 },
      { name: "Phan Thiết", region: "south", id_vn: 260, biz_vn: 180 },
      { name: "Tuy Hòa", region: "central", id_vn: 250, biz_vn: 170 },
      { name: "Việt Trì", region: "north", id_vn: 240, biz_vn: 160 },
      { name: "Thái Bình", region: "north", id_vn: 230, biz_vn: 150 },
      { name: "Hà Tĩnh", region: "central", id_vn: 220, biz_vn: 140 },
      { name: "Vũng Tàu", region: "south", id_vn: 210, biz_vn: 130 },
      { name: "Pleiku", region: "central", id_vn: 200, biz_vn: 120 },
      { name: "Mỹ Tho", region: "south", id_vn: 190, biz_vn: 110 },
      { name: "Đông Hà", region: "central", id_vn: 180, biz_vn: 100 },
      { name: "Cao Lãnh", region: "south", id_vn: 170, biz_vn: 90 },
      { name: "Tam Kỳ", region: "central", id_vn: 160, biz_vn: 80 },
      { name: "Kon Tum", region: "central", id_vn: 150, biz_vn: 70 },
      { name: "Sóc Trăng", region: "south", id_vn: 140, biz_vn: 60 },
      { name: "Lạng Sơn", region: "north", id_vn: 130, biz_vn: 50 },
      { name: "Hòa Bình", region: "north", id_vn: 120, biz_vn: 40 },
      { name: "Bắc Giang", region: "north", id_vn: 110, biz_vn: 30 },
      { name: "Vĩnh Long", region: "south", id_vn: 100, biz_vn: 25 },
      { name: "Bến Tre", region: "south", id_vn: 95, biz_vn: 20 },
      { name: "Trà Vinh", region: "south", id_vn: 90, biz_vn: 18 },
      { name: "An Giang", region: "south", id_vn: 85, biz_vn: 15 },
      { name: "Kiên Giang", region: "south", id_vn: 80, biz_vn: 12 },
      { name: "Cà Mau", region: "south", id_vn: 75, biz_vn: 10 },
      { name: "Bạc Liêu", region: "south", id_vn: 70, biz_vn: 8 },
      { name: "Hậu Giang", region: "south", id_vn: 65, biz_vn: 5 },
    ]

    this.originalData = provinces.map((province, index) => ({
      stt: index + 1,
      province: province.name,
      region: province.region,
      id_vn: province.id_vn,
      biz_vn: province.biz_vn,
      total: province.id_vn + province.biz_vn,
    }))

    this.data = [...this.originalData]
  }

  setupEventListeners() {
    document.getElementById("refreshBtn").addEventListener("click", () => this.refreshData())
    document.getElementById("searchInput").addEventListener("input", (e) => this.filterTable(e.target.value))
    document.getElementById("sortSelect").addEventListener("change", (e) => this.sortTable(e.target.value))
  }

  refreshData() {
    this.showLoading()

    // Simulate loading delay
    setTimeout(() => {
      // Add some random variation to simulate real data changes
      this.data = this.originalData
        .map((item) => ({
          ...item,
          id_vn: item.id_vn + Math.floor(Math.random() * 20) - 10,
          biz_vn: item.biz_vn + Math.floor(Math.random() * 15) - 7,
        }))
        .map((item) => ({
          ...item,
          total: item.id_vn + item.biz_vn,
        }))

      this.renderDashboard()
      this.updateLastUpdateTime()
      this.showDashboard()
    }, 1500)
  }

  renderDashboard() {
    this.updateSummaryCards()
    this.updateRegionalStats()
    this.renderCharts()
    this.renderTable()
  }

  updateSummaryCards() {
    const totalIdVn = this.data.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = this.data.reduce((sum, item) => sum + item.biz_vn, 0)
    const totalProvinces = this.data.length
    const totalDomains = totalIdVn + totalBizVn

    document.getElementById("totalIdVn").textContent = totalIdVn.toLocaleString()
    document.getElementById("totalBizVn").textContent = totalBizVn.toLocaleString()
    document.getElementById("totalProvinces").textContent = totalProvinces.toLocaleString()
    document.getElementById("totalDomains").textContent = totalDomains.toLocaleString()
  }

  updateRegionalStats() {
    const regions = {
      north: this.data.filter((item) => item.region === "north").reduce((sum, item) => sum + item.total, 0),
      central: this.data.filter((item) => item.region === "central").reduce((sum, item) => sum + item.total, 0),
      south: this.data.filter((item) => item.region === "south").reduce((sum, item) => sum + item.total, 0),
    }

    document.getElementById("northTotal").textContent = regions.north.toLocaleString()
    document.getElementById("centralTotal").textContent = regions.central.toLocaleString()
    document.getElementById("southTotal").textContent = regions.south.toLocaleString()
  }

  renderCharts() {
    this.renderDomainTypeChart()
    this.renderTopProvincesChart()
  }

  renderDomainTypeChart() {
    const ctx = document.getElementById("domainTypeChart").getContext("2d")

    if (this.charts.domainType) {
      this.charts.domainType.destroy()
    }

    const totalIdVn = this.data.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = this.data.reduce((sum, item) => sum + item.biz_vn, 0)

    this.charts.domainType = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["ID.VN", "BIZ.VN"],
        datasets: [
          {
            data: [totalIdVn, totalBizVn],
            backgroundColor: ["#3B82F6", "#10B981"],
            borderWidth: 3,
            borderColor: "#ffffff",
            hoverBorderWidth: 4,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
                weight: "bold",
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = totalIdVn + totalBizVn
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1000,
        },
      },
    })
  }

  renderTopProvincesChart() {
    const ctx = document.getElementById("topProvincesChart").getContext("2d")

    if (this.charts.topProvinces) {
      this.charts.topProvinces.destroy()
    }

    const sortedData = [...this.data].sort((a, b) => b.total - a.total).slice(0, 10)

    this.charts.topProvinces = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedData.map((item) => item.province),
        datasets: [
          {
            label: "ID.VN",
            data: sortedData.map((item) => item.id_vn),
            backgroundColor: "#3B82F6",
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: "BIZ.VN",
            data: sortedData.map((item) => item.biz_vn),
            backgroundColor: "#10B981",
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              font: {
                size: 10,
              },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: "#f3f4f6",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                weight: "bold",
              },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              footer: (tooltipItems) => {
                let total = 0
                tooltipItems.forEach((tooltipItem) => {
                  total += tooltipItem.parsed.y
                })
                return `Tổng: ${total.toLocaleString()}`
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    })
  }

  renderTable(filteredData = null) {
    const data = filteredData || this.data
    const tbody = document.getElementById("dataTableBody")
    const totalDomains = this.data.reduce((sum, d) => sum + d.total, 0)

    tbody.innerHTML = data
      .map((item) => {
        const percentage = ((item.total / totalDomains) * 100).toFixed(1)
        const status = this.getStatus(item.total)

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.stt}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-map-marker-alt text-gray-600 text-xs"></i>
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">${item.province}</div>
                  <div class="text-xs text-gray-500">${this.getRegionName(item.region)}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-medium">${item.id_vn.toLocaleString()}</div>
              <div class="w-full bg-blue-100 rounded-full h-1.5 mt-1">
                <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${(item.id_vn / Math.max(...this.data.map((d) => d.id_vn))) * 100}%"></div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-medium">${item.biz_vn.toLocaleString()}</div>
              <div class="w-full bg-green-100 rounded-full h-1.5 mt-1">
                <div class="bg-green-600 h-1.5 rounded-full" style="width: ${(item.biz_vn / Math.max(...this.data.map((d) => d.biz_vn))) * 100}%"></div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${item.total.toLocaleString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${percentage}%</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}">
                <i class="${status.icon} mr-1"></i>
                ${status.text}
              </span>
            </td>
          </tr>
        `
      })
      .join("")

    // Update table stats
    document.getElementById("showingCount").textContent = data.length
    document.getElementById("totalCount").textContent = this.data.length
    document.getElementById("grandTotal").textContent = totalDomains.toLocaleString()
  }

  getRegionName(region) {
    const regions = {
      north: "Miền Bắc",
      central: "Miền Trung",
      south: "Miền Nam",
    }
    return regions[region] || ""
  }

  getStatus(total) {
    if (total >= 1000) {
      return { text: "Cao", class: "bg-green-100 text-green-800", icon: "fas fa-arrow-up" }
    } else if (total >= 500) {
      return { text: "Trung bình", class: "bg-yellow-100 text-yellow-800", icon: "fas fa-minus" }
    } else {
      return { text: "Thấp", class: "bg-red-100 text-red-800", icon: "fas fa-arrow-down" }
    }
  }

  filterTable(searchTerm) {
    const filtered = this.data.filter((item) => item.province.toLowerCase().includes(searchTerm.toLowerCase()))
    this.renderTable(filtered)
  }

  sortTable(sortBy) {
    const sorted = [...this.data]

    switch (sortBy) {
      case "province":
        sorted.sort((a, b) => a.province.localeCompare(b.province))
        break
      case "total":
        sorted.sort((a, b) => b.total - a.total)
        break
      case "id_vn":
        sorted.sort((a, b) => b.id_vn - a.id_vn)
        break
      case "biz_vn":
        sorted.sort((a, b) => b.biz_vn - a.biz_vn)
        break
    }

    this.renderTable(sorted)
  }

  updateLastUpdateTime() {
    const now = new Date()
    const timeString = now.toLocaleString("vi-VN")
    document.getElementById("lastUpdate").textContent = timeString
  }

  showLoading() {
    document.getElementById("loadingState").classList.remove("hidden")
    document.getElementById("dashboardContent").classList.add("hidden")
  }

  showDashboard() {
    document.getElementById("loadingState").classList.add("hidden")
    document.getElementById("dashboardContent").classList.remove("hidden")
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DomainDashboardDemo()
})
