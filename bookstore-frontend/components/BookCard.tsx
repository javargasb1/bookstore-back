// components/BookCard.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import type { Book } from '@/types/book'

export default function BookCard({
  book,
  onDelete,
}: {
  book: Book;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl">
        <Image src={book.image || '/placeholder.png'} alt={book.name} fill className="object-cover"/>
      </div>
      <h3 className="mt-3 text-xl font-semibold">{book.name}</h3>
      <p className="text-sm text-slate-600">{new Date(book.publishingDate).toLocaleDateString()}</p>
      <p className="mt-2 text-slate-700 line-clamp-3">{book.description}</p>
      <p className="mt-1 text-xs text-slate-500">Editorial: {book.editorial?.name ?? '—'}</p>

      <div className="mt-3 flex gap-2">
        <Link href={`/books/${book.id}`} className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm text-center hover:opacity-90">
          Ver detalle
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(book.id)}
            className="rounded-lg bg-red-600 text-white px-3 py-2 text-sm hover:opacity-90"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
