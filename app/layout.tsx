import React from "react"
import type { Metadata, Viewport } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Hackify - Master Ethical Hacking',
  description: 'Learn ethical hacking and cybersecurity through gamified courses. Level up your skills, earn XP, and become a certified ethical hacker.',
  keywords: ['ethical hacking', 'cybersecurity', 'hacking courses', 'penetration testing', 'security training'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#00ff00',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${shareTechMono.className} font-mono antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
