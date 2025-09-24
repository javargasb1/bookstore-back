'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listBooks } from '@/lib/books'
import type { Book } from '@/types/book'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { setBooks(await listBooks()) }
      catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)) }
      finally { setLoading(false) }
    })()
  }, [])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Libros</h1>
      {loading && <p>Cargando…</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {books.map(b => (
          <Link key={b.id} href={`/books/${b.id}`} className="bg-white rounded-xl shadow p-3 hover:shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt={b.title} className="w-full aspect-[3/4] object-cover rounded-lg"/>
            <h4 className="mt-2 font-semibold line-clamp-2">{b.title}</h4>
            <p className="text-xs text-slate-500">{new Date(b.publicationDate).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
