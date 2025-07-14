import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChromaMinerIcon from '@/components/ChromaMinerIcon'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChromaMiner',
  description: 'Mine and explore your ChromaDB vector collections with powerful search and visualization tools',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <ChromaMinerIcon className="w-8 h-8 text-indigo-600" size={32} />
                      <h1 className="text-xl font-bold text-slate-900">ChromaMiner</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 