import { Button as HeroButton, HeroUIProvider } from '@heroui/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'; // Custom provider for Firebase, etc.

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindGreen: Heal Yourself, Heal the Planet',
  description: 'Gamified mental health and sustainability app',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <HeroUIProvider>
            {/* simple toggle placeholder - HeroUI includes color-mode helpers in its components */}
            <div style={{ position: 'absolute', right: 20, top: 20 }}>
              <HeroButton color="primary" size="sm">Toggle</HeroButton>
            </div>
            {children}
          </HeroUIProvider>
        </Providers>
      </body>
    </html>
  )
}
