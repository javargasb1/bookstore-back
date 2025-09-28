'use client'
import Image from 'next/image'
import Link from 'next/link'
import type { Author } from '@/types/author'

export default function AuthorCard({ author, onDelete }: { author: Author; onDelete?: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl">
        <Image src={author.image || '/placeholder.png'} alt={author.name} fill className="object-cover"/>
      </div>
      <h3 className="mt-3 text-xl font-semibold">{author.name}</h3>
      <p className="text-sm text-slate-600">{new Date(author.birthDate).toLocaleDateString()}</p>
      <p className="mt-2 text-slate-700 line-clamp-3">{author.description}</p>
      <p className="mt-1 text-xs text-slate-500">Libros: {author.books?.length ?? 0} · Premios: {author.prizes?.length ?? 0}</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/authors/${author.id}/edit`} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-90">Editar</Link>
        <button onClick={() => onDelete?.(author.id)} className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:opacity-90">Eliminar</button>
      </div>
    </div>
  )
}
