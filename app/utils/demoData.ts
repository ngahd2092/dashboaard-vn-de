export interface CommonDocumentData {
  id: string
  title: string
  type: "decision" | "circular" | "directive" | "plan" | "guideline"
  number: string
  date: string
  status: "active" | "draft" | "expired"
  description?: string
  url?: string
  fileSize?: string
  downloadCount?: number
}

export interface DocumentData {
  id: string
  title: string
  type: "decision" | "circular" | "directive" | "plan"
  number: string
  date: string
  status: "active" | "draft" | "expired"
  url?: string
}

export interface ProvinceData {
  stt: number
  province: string
  region: "north" | "central" | "south"
  id_vn: number
  biz_vn: number
  total: number
  documents: DocumentData[]
}

export function generateCommonDocuments(): CommonDocumentData[] {
  return [
    {
      id: "common-001",
      title: "Quyết định về việc triển khai tên miền quốc gia .id.vn và .biz.vn",
      type: "decision",
      number: "123/QĐ-BTTTT",
      date: "2024-01-15",
      status: "active",
      description: "Quyết định ban hành quy định về triển khai và quản lý tên miền quốc gia",
      fileSize: "2.5 MB",
      downloadCount: 1250,
    },
    {
      id: "common-002",
      title: "Thông tư hướng dẫn đăng ký và sử dụng tên miền .id.vn",
      type: "circular",
      number: "45/TT-BTTTT",
      date: "2024-02-20",
      status: "active",
      description: "Hướng dẫn chi tiết quy trình đăng ký và sử dụng tên miền cá nhân",
      fileSize: "1.8 MB",
      downloadCount: 890,
    },
    {
      id: "common-003",
      title: "Chỉ thị về đẩy mạnh chuyển đổi số và sử dụng tên miền quốc gia",
      type: "directive",
      number: "67/CT-TTg",
      date: "2024-03-10",
      status: "active",
      description: "Chỉ thị của Thủ tướng về việc đẩy mạnh sử dụng tên miền quốc gia",
      fileSize: "3.2 MB",
      downloadCount: 2100,
    },
    {
      id: "common-004",
      title: "Kế hoạch phát triển hạ tầng tên miền quốc gia giai đoạn 2024-2030",
      type: "plan",
      number: "89/KH-BTTTT",
      date: "2024-04-05",
      status: "active",
      description: "Kế hoạch tổng thể phát triển hạ tầng tên miền quốc gia",
      fileSize: "4.1 MB",
      downloadCount: 650,
    },
    {
      id: "common-005",
      title: "Hướng dẫn kỹ thuật triển khai DNS cho tên miền .biz.vn",
      type: "guideline",
      number: "12/HD-VNNIC",
      date: "2024-05-15",
      status: "active",
      description: "Tài liệu hướng dẫn kỹ thuật cho nhà cung cấp dịch vụ",
      fileSize: "5.7 MB",
      downloadCount: 420,
    },
  ]
}

export function generateDemoData(): ProvinceData[] {
  console.log("generateDemoData called")

  // Hàm tạo văn bản mẫu cho từng tỉnh
  const generateDocuments = (provinceName: string): DocumentData[] => {
    console.log("Generating documents for:", provinceName)
    const baseDocuments = [
      {
        id: `${provinceName}-001`,
        title: `Quyết định triển khai tên miền .id.vn tại ${provinceName}`,
        type: "decision" as const,
        number: `${Math.floor(Math.random() * 900) + 100}/QĐ-UBND`,
        date: "2024-01-15",
        status: "active" as const,
      },
      {
        id: `${provinceName}-002`,
        title: `Thông tư hướng dẫn sử dụng tên miền .biz.vn tại ${provinceName}`,
        type: "circular" as const,
        number: `${Math.floor(Math.random() * 50) + 10}/TT-STTTT`,
        date: "2024-02-20",
        status: "active" as const,
      },
      {
        id: `${provinceName}-003`,
        title: `Kế hoạch phát triển tên miền quốc gia năm 2024 - ${provinceName}`,
        type: "plan" as const,
        number: `${Math.floor(Math.random() * 200) + 50}/KH-UBND`,
        date: "2024-03-10",
        status: "active" as const,
      },
      {
        id: `${provinceName}-004`,
        title: `Báo cáo tình hình triển khai tên miền quý I/2024 - ${provinceName}`,
        type: "plan" as const,
        number: `${Math.floor(Math.random() * 100) + 20}/BC-STTTT`,
        date: "2024-04-15",
        status: "active" as const,
      },
    ]

    // Thêm văn bản đặc biệt cho một số tỉnh lớn
    if (["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"].includes(provinceName)) {
      baseDocuments.push({
        id: `${provinceName}-005`,
        title: `Chỉ thị về đẩy mạnh chuyển đổi số và sử dụng tên miền quốc gia - ${provinceName}`,
        type: "directive" as const,
        number: `${Math.floor(Math.random() * 30) + 1}/CT-UBND`,
        date: "2024-04-05",
        status: "active" as const,
      })

      baseDocuments.push({
        id: `${provinceName}-006`,
        title: `Quy định về quản lý và sử dụng tên miền trong cơ quan nhà nước - ${provinceName}`,
        type: "decision" as const,
        number: `${Math.floor(Math.random() * 50) + 10}/QĐ-UBND`,
        date: "2024-05-20",
        status: "active" as const,
      })
    }

    return baseDocuments
  }

  // 34 tỉnh thành của Việt Nam sau sáp nhập (2024)
  const provinces = [
    // Miền Bắc (17 tỉnh thành)
    { name: "Hà Nội", region: "north" as const, id_vn: 2200, biz_vn: 1600 },
    { name: "Hải Phòng", region: "north" as const, id_vn: 650, biz_vn: 480 },
    { name: "Quảng Ninh", region: "north" as const, id_vn: 420, biz_vn: 300 },
    { name: "Bắc Giang", region: "north" as const, id_vn: 280, biz_vn: 200 },
    { name: "Phú Thọ", region: "north" as const, id_vn: 320, biz_vn: 240 },
    { name: "Vĩnh Phúc", region: "north" as const, id_vn: 250, biz_vn: 180 },
    { name: "Bắc Ninh", region: "north" as const, id_vn: 380, biz_vn: 280 },
    { name: "Hải Dương", region: "north" as const, id_vn: 290, biz_vn: 210 },
    { name: "Hưng Yên", region: "north" as const, id_vn: 220, biz_vn: 160 },
    { name: "Thái Bình", region: "north" as const, id_vn: 230, biz_vn: 150 },
    { name: "Hà Nam", region: "north" as const, id_vn: 180, biz_vn: 120 },
    { name: "Nam Định", region: "north" as const, id_vn: 270, biz_vn: 190 },
    { name: "Ninh Bình", region: "north" as const, id_vn: 200, biz_vn: 140 },
    { name: "Thanh Hóa", region: "north" as const, id_vn: 450, biz_vn: 320 },
    { name: "Nghệ An", region: "north" as const, id_vn: 380, biz_vn: 270 },
    { name: "Hà Tĩnh", region: "north" as const, id_vn: 220, biz_vn: 140 },
    { name: "Quảng Bình", region: "north" as const, id_vn: 190, biz_vn: 130 },

    // Miền Trung (8 tỉnh thành)
    { name: "Quảng Trị", region: "central" as const, id_vn: 160, biz_vn: 110 },
    { name: "Thừa Thiên Huế", region: "central" as const, id_vn: 450, biz_vn: 320 },
    { name: "Đà Nẵng", region: "central" as const, id_vn: 800, biz_vn: 600 },
    { name: "Quảng Nam", region: "central" as const, id_vn: 350, biz_vn: 250 },
    { name: "Quảng Ngãi", region: "central" as const, id_vn: 280, biz_vn: 200 },
    { name: "Bình Định", region: "central" as const, id_vn: 320, biz_vn: 230 },
    { name: "Phú Yên", region: "central" as const, id_vn: 250, biz_vn: 170 },
    { name: "Khánh Hòa", region: "central" as const, id_vn: 420, biz_vn: 300 },

    // Miền Nam (25 tỉnh thành)
    { name: "Ninh Thuận", region: "south" as const, id_vn: 150, biz_vn: 100 },
    { name: "Bình Thuận", region: "south" as const, id_vn: 260, biz_vn: 180 },
    { name: "Kon Tum", region: "south" as const, id_vn: 120, biz_vn: 80 },
    { name: "Gia Lai", region: "south" as const, id_vn: 200, biz_vn: 140 },
    { name: "Đắk Lắk", region: "south" as const, id_vn: 380, biz_vn: 280 },
    { name: "Đắk Nông", region: "south" as const, id_vn: 140, biz_vn: 90 },
    { name: "Lâm Đồng", region: "south" as const, id_vn: 300, biz_vn: 220 },
    { name: "Bình Phước", region: "south" as const, id_vn: 180, biz_vn: 120 },
    { name: "Tây Ninh", region: "south" as const, id_vn: 170, biz_vn: 110 },
    { name: "Bình Dương", region: "south" as const, id_vn: 650, biz_vn: 480 },
    { name: "Đồng Nai", region: "south" as const, id_vn: 520, biz_vn: 380 },
    { name: "Bà Rịa - Vũng Tàu", region: "south" as const, id_vn: 350, biz_vn: 250 },
    { name: "TP. Hồ Chí Minh", region: "south" as const, id_vn: 2500, biz_vn: 1800 },
    { name: "Long An", region: "south" as const, id_vn: 220, biz_vn: 160 },
    { name: "Tiền Giang", region: "south" as const, id_vn: 200, biz_vn: 140 },
    { name: "Bến Tre", region: "south" as const, id_vn: 150, biz_vn: 100 },
    { name: "Trà Vinh", region: "south" as const, id_vn: 130, biz_vn: 90 },
    { name: "Vĩnh Long", region: "south" as const, id_vn: 140, biz_vn: 95 },
    { name: "Đồng Tháp", region: "south" as const, id_vn: 180, biz_vn: 120 },
    { name: "An Giang", region: "south" as const, id_vn: 200, biz_vn: 140 },
    { name: "Kiên Giang", region: "south" as const, id_vn: 250, biz_vn: 170 },
    { name: "Cần Thơ", region: "south" as const, id_vn: 580, biz_vn: 420 },
    { name: "Hậu Giang", region: "south" as const, id_vn: 120, biz_vn: 80 },
    { name: "Sóc Trăng", region: "south" as const, id_vn: 160, biz_vn: 110 },
    { name: "Bạc Liêu", region: "south" as const, id_vn: 110, biz_vn: 70 },
    { name: "Cà Mau", region: "south" as const, id_vn: 130, biz_vn: 85 },
  ]

  const result = provinces.map((province, index) => ({
    stt: index + 1,
    province: province.name,
    region: province.region,
    id_vn: province.id_vn,
    biz_vn: province.biz_vn,
    total: province.id_vn + province.biz_vn,
    documents: generateDocuments(province.name),
  }))

  console.log("Generated data result:", result.length, "provinces")
  return result
}
