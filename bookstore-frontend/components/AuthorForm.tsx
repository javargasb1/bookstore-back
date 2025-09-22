// components/AuthorForm.tsx
'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AuthorInput, Author } from '@/types/author'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  image: z.string().url('Debe ser una URL válida'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
})

type Props = {
  defaultValues?: Partial<Author>;
  onSubmit: (data: AuthorInput) => Promise<void> | void;
  submitLabel?: string;
}

export default function AuthorForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthorInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      image: defaultValues?.image ?? '',
      birthDate: defaultValues?.birthDate ?? ''
    }
  });

  const submit = async (data: AuthorInput) => {
    setSubmitting(true);
    try { await onSubmit(data); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-xl w-full bg-white p-6 rounded-2xl shadow space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Nombre</label>
        <input {...register('name')} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Gabriel García Márquez" />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Descripción</label>
        <textarea {...register('description')} className="mt-1 w-full rounded-lg border px-3 py-2" rows={4} placeholder="Autor colombiano, Premio Nobel..." />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Imagen (URL)</label>
          <input {...register('image')} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="https://..." />
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fecha de nacimiento (YYYY-MM-DD)</label>
          <input {...register('birthDate')} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="1927-03-06" />
          {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-slate-900 text-white py-2.5 hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
