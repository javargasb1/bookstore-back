// components/AuthorCard.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import type { Author } from '@/types/author'

type Props = {
  author: Author;
  onDelete?: (id: number) => void;
}

export default function AuthorCard({ author, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl">
        <Image
          src={author.image || '/placeholder.png'}
          alt={author.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <h3 className="mt-3 text-xl font-semibold text-slate-900">{author.name}</h3>
      <p className="text-sm text-slate-600">{new Date(author.birthDate).toLocaleDateString()}</p>
      <p className="mt-2 text-slate-700 line-clamp-3">{author.description}</p>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/authors/${author.id}/edit`}
          className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-90"
        >
          Editar
        </Link>
        <button
          onClick={() => onDelete?.(author.id)}
          className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:opacity-90"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
