import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import MockProvider from '@/mocks/MockProvider'

export const metadata: Metadata = {
  title: '수강 신청',
  description: '다단계 수강 신청 폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <QueryProvider>
          <MockProvider>{children}</MockProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
