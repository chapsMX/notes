import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chapsbox - Tu segundo cerebro en la nube',
  description: 'Organiza, busca y gestiona toda tu información',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
