import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tagesplaner',
  keywords: ['Tagesplaner', 'Zeitmanagement', 'Produktivität', 'Planung', 'Aufgabenverwaltung'],
  description: 'Ein moderner Tagesplaner mit konfigurierbaren Zeitintervallen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
