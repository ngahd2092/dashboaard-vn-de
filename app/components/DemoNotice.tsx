export default function DemoNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <i className="fas fa-info-circle text-blue-600 mr-3"></i>
        <div>
          <h3 className="text-sm font-medium text-blue-800">Đây là phiên bản demo</h3>
          <p className="text-sm text-blue-700 mt-1">
            Dữ liệu hiển thị là dữ liệu mẫu để minh họa. 
          </p>
        </div>
      </div>
    </div>
  )
}
