# Dashboard Triển Khai Tên Miền ID.VN & BIZ.VN

Dashboard thống kê số liệu triển khai tên miền ID.VN và BIZ.VN theo từng tỉnh thành, lấy dữ liệu từ Google Sheets.

## Tính năng

- **Thống kê tổng quan**: Hiển thị tổng số tên miền ID.VN, BIZ.VN, số tỉnh triển khai
- **Biểu đồ trực quan**: 
  - Biểu đồ tròn phân bố loại tên miền
  - Biểu đồ cột top 10 tỉnh có nhiều tên miền nhất
- **Bảng chi tiết**: Danh sách đầy đủ theo tỉnh với chức năng tìm kiếm và sắp xếp
- **Cập nhật real-time**: Đồng bộ dữ liệu từ Google Sheets
- **Responsive design**: Tương thích mọi thiết bị

## Cách sử dụng

### 1. Chuẩn bị Google Sheets

Tạo Google Sheets với cấu trúc dữ liệu:
\`\`\`
| Tỉnh/Thành phố | ID.VN | BIZ.VN |
|----------------|-------|--------|
| Hà Nội         | 1500  | 800    |
| TP.HCM         | 2000  | 1200   |
| Đà Nẵng        | 500   | 300    |
\`\`\`

### 2. Cấu hình Google Sheets API

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Sheets API
4. Tạo API Key
5. Chia sẻ Google Sheets với quyền "Viewer" cho mọi người hoặc cụ thể

### 3. Cấu hình Dashboard

1. Mở dashboard lần đầu sẽ hiện popup cấu hình
2. Nhập:
   - **Google Sheets ID**: Lấy từ URL của Google Sheets
   - **API Key**: API Key đã tạo ở bước 2
   - **Tên Sheet**: Tên sheet chứa dữ liệu (mặc định: Sheet1)

### 4. Sử dụng Dashboard

- **Cập nhật dữ liệu**: Click nút "Cập nhật dữ liệu"
- **Tìm kiếm**: Nhập tên tỉnh vào ô tìm kiếm
- **Sắp xếp**: Chọn tiêu chí sắp xếp từ dropdown
- **Xem biểu đồ**: Tương tác với các biểu đồ để xem chi tiết

## Cấu trúc dữ liệu Google Sheets

Dashboard yêu cầu Google Sheets có cấu trúc:
- **Cột A**: Tên tỉnh/thành phố
- **Cột B**: Số lượng tên miền ID.VN
- **Cột C**: Số lượng tên miền BIZ.VN
- **Hàng 1**: Header (sẽ được bỏ qua khi xử lý)

## Tính năng nâng cao

- **Lưu cấu hình**: Thông tin cấu hình được lưu trong localStorage
- **Xử lý lỗi**: Hiển thị thông báo lỗi khi không thể kết nối
- **Loading state**: Hiển thị trạng thái đang tải dữ liệu
- **Responsive**: Tự động điều chỉnh giao diện theo kích thước màn hình

## Bảo mật

- API Key được lưu trong localStorage của trình duyệt
- Không gửi dữ liệu nhạy cảm lên server
- Sử dụng HTTPS cho tất cả API calls

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Google Sheets có được chia sẻ công khai
2. Xác nhận API Key còn hiệu lực
3. Kiểm tra cấu trúc dữ liệu trong Google Sheets
4. Mở Developer Tools để xem lỗi chi tiết
