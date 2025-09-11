import './globals.css'
import Header from '@/components/Header'

export const metadata = { title: 'TrailFuel', description: 'Plans nutrition trail' }

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="max-w-5xl mx-auto p-4 space-y-6">{children}</main>
      </body>
    </html>
  )
}
