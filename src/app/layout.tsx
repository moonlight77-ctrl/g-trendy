import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'GranDressing',
  description: 'Location de vêtements stylée et durable',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className }>
        <Navbar />
        {children}
         <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  )
}
