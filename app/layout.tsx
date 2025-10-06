import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './providers/AuthProvider'

export const metadata: Metadata = {
  title: 'MemeFlow - Viral Memes on Farcaster',
  description: 'Catch viral memes before they peak—curated, fresh, and ready to post.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="default">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
