import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Somos Su Voz — Pim Pum Pam',
  description: 'Grupo de proteccionistas comprometidos con el bienestar animal. Adoptá, donà y ayudanos a darles una voz.',
  icons: {
    icon: '/assets/logonew.png',
    shortcut: '/assets/logonew.png',
    apple: '/assets/logonew.png',
  },
  openGraph: {
    title: 'Somos Su Voz — Pim Pum Pam',
    description: 'Adoptá, donà y ayudanos a darles una voz.',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#2C2B1E',
              border: '1px solid #EDE6D4',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#E8891A', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
