import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-display-var' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-body-var' })

export const metadata: Metadata = {
  title: 'Waychem ReportLab',
  description: 'Sistema inteligente de reportes técnicos de tratamiento de aguas industriales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
