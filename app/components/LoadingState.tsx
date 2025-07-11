export default function LoadingState() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải dashboard...</h2>
        <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  )
}
