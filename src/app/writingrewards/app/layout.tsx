import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IWrite',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Remove <html> and <body> from here, let the app root handle them
    <>
      {children}
    </>
  )
}
