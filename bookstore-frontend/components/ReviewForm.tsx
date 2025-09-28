'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { NewReviewInput } from '@/types/book'

const schema = z.object({
  name: z.string().min(1, 'Requerido'),
  source: z.string().min(1, 'Requerido'),
  description: z.string().min(5, 'Mínimo 5 caracteres')
})

export default function ReviewForm({ onSubmit }: { onSubmit: (d: NewReviewInput) => Promise<void> | void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<NewReviewInput>({
    resolver: zodResolver(schema)
  });

  const submit = async (d: NewReviewInput) => { await onSubmit(d); reset(); };

  return (
    <form onSubmit={handleSubmit(submit)} className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input {...register('name')} className="mt-1 w-full border rounded-lg px-3 py-2"/>
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Fuente</label>
        <input {...register('source')} className="mt-1 w-full border rounded-lg px-3 py-2"/>
        {errors.source && <p className="text-red-600 text-sm">{errors.source.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <textarea {...register('description')} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2"/>
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>
      <button disabled={isSubmitting} className="w-full bg-slate-900 text-white rounded-lg py-2">
        {isSubmitting ? 'Enviando...' : 'Agregar review'}
      </button>
    </form>
  )
}
