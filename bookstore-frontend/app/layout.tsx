// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bookstore CRUD', description: 'Preparcial Next.js' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Bookstore CRUD</h1>
            <nav className="flex gap-4">
              <a href="/authors" className="hover:underline">Autores</a>
              <a href="/authors/new" className="hover:underline">Crear Autor</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
