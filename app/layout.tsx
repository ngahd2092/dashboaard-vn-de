import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard phát triển tên miền .vn - by VNNIC Đà Nẵng',
  description: 'Dashboard phát triển tên miền .vn',
  generator: 'VNNIC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
