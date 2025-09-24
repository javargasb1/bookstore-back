'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBook, createReview } from '@/lib/books'
import type { Book, Review, ReviewInput } from '@/types/book'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)
  const [book, setBook] = useState<(Book & { reviews?: Review[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  // form mínimo
  const [revTitle, setRevTitle] = useState('')
  const [revContent, setRevContent] = useState('')
  const [revRating, setRevRating] = useState<number | ''>('')

  async function load() {
    try { setBook(await getBook(bookId)); setErr(null) }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [bookId])

  async function onCreateReview(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload: ReviewInput = {
        title: revTitle, content: revContent, rating: Number(revRating || 0)
      }
      await createReview(bookId, payload)
      setRevTitle(''); setRevContent(''); setRevRating('')
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e))
    }
  }

  if (loading) return <p>Cargando…</p>
  if (err) return <p className="text-red-600">{err}</p>
  if (!book) return <p>No encontrado</p>

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-[1fr,2fr] gap-6 bg-white rounded-xl shadow p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.image} alt={book.title} className="w-full aspect-[3/4] object-cover rounded-lg"/>
        <div>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-slate-600">{new Date(book.publicationDate).toLocaleDateString()}</p>
          <p className="mt-3 text-slate-800 whitespace-pre-wrap">{book.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Reviews</h3>
          {(!book.reviews || book.reviews.length === 0) ? (
            <p className="text-slate-600">Este libro aún no tiene reviews.</p>
          ) : (
            <ul className="space-y-3">
              {book.reviews.map(r => (
                <li key={r.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{r.title}</h4>
                    <span className="text-sm text-slate-600">⭐ {r.rating}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{r.content}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={onCreateReview} className="bg-white rounded-xl shadow p-4 space-y-2">
          <h4 className="font-semibold">Agregar review</h4>
          <input value={revTitle} onChange={e=>setRevTitle(e.target.value)} placeholder="Título" className="w-full border rounded px-3 py-2"/>
          <textarea value={revContent} onChange={e=>setRevContent(e.target.value)} placeholder="Contenido" className="w-full border rounded px-3 py-2" rows={3}/>
          <input type="number" min={1} max={5} value={revRating} onChange={e=>setRevRating(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Rating (1-5)" className="w-full border rounded px-3 py-2"/>
          <button className="w-full bg-slate-900 text-white rounded-lg py-2">Crear review</button>
        </form>
      </div>
    </section>
  )
}
