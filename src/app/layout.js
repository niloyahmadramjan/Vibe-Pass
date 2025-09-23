// not allow to write code here
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'
import ReactQueryProvider from './providers/ReactQueryProvider'
import { AuthProvider } from './context/AuthContext'
import { SessionProvider } from 'next-auth/react'
import SessionProviderWrapper from './providers/SessionProviderWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Vibe Pass | Movie Ticket Booking Platform',
  description:
    'Vibe Pass is a modern movie ticket booking platform where users can browse movies, check showtimes, select seats, and book tickets online with ease.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SessionProviderWrapper>
            <ReactQueryProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ReactQueryProvider>
          </SessionProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
