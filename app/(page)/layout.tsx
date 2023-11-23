import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AuthProvider from '../util/provider/AuthProvider'
import NotificationBar from '../components/navigation/NotificationBar'
import FollowRecomendation from '../components/navigation/FollowRecomendation'

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
      <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-6xl flex w-full">
      <NotificationBar />
      <div className="w-7/12 px-6 py-4 flex flex-col h-screen justify-start overflow-y-scroll">
      {children}
      </div>
      <FollowRecomendation />
     </div>
    </main></body>
      </AuthProvider>
    </html>
  )
}
