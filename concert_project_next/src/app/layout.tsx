import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Out2Nite - Discover Groningen\'s Nightlife',
  description: 'Discover concerts, parties, meetups, and hidden gems in Groningen tonight',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
      </head>
      <body className="bg-dark-900 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
