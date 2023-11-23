import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AuthProvider from '@/app/util/provider/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wolfling',
  description: 'A social media app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>
    <div className='flex items-center justify-center w-screen h-screen'>{children}</div>
    </body>
    </AuthProvider>
    </html>
  )
}