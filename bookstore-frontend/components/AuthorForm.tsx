// components/AuthorForm.tsx
'use client'

import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AuthorInput } from '@/types/author'
import type { NewBookFormInput } from '@/types/book'
import type { NewPrizeFormInput } from '@/types/prize'

// ---------- Schemas (coinciden con tu backend) ----------
const authorSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  image: z.string().url('Debe ser una URL válida'),
})

const bookSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  isbn: z.string().min(3, 'ISBN requerido'),
  image: z.string().url('Debe ser una URL válida'),
  publishingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  editorialId: z.coerce.number().int().positive('editorialId debe ser > 0'),
})

const prizeSchema = z.object({
  premiationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().min(5, 'Mínimo 5 caracteres'),
  organizationId: z.coerce.number().int().positive('organizationId debe ser > 0'),
})

// ---------- Tipo del formulario completo ----------
export type FullPayload = {
  author: AuthorInput
  book: NewBookFormInput
  prize: NewPrizeFormInput
}

// Schema combinado
const formSchema = z.object({
  author: authorSchema,
  book: bookSchema,
  prize: prizeSchema,
})

// Resolver tipado explícitamente para RHF
const resolver: Resolver<FullPayload> = zodResolver(formSchema) as unknown as Resolver<FullPayload>

type Props = {
  onSubmit: (data: FullPayload) => Promise<void> | void
}

export default function AuthorForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FullPayload>({
    resolver, // 👈 resolver ya está tipado
    defaultValues: {
      author: { name: '', description: '', image: '', birthDate: '' },
      book: {
        name: '',
        isbn: '',
        image: '',
        publishingDate: '',
        description: '',
        editorialId: 1000,
      },
      prize: {
        name: '',
        premiationDate: '',
        description: '',
        organizationId: 1000,
      },
    },
  })

  // Tipamos el submit handler para que coincida 100%
  const submit: SubmitHandler<FullPayload> = async (data) => {
    await onSubmit(data)
  }

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string
    error?: string
    children: React.ReactNode
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-3xl space-y-6">
      {/* Autor */}
      <Card title="Autor">
        <Field label="Nombre" error={errors.author?.name?.message}>
          <input
            {...register('author.name')}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Gabriel García Márquez"
          />
        </Field>

        <Field label="Descripción" error={errors.author?.description?.message}>
          <textarea
            {...register('author.description')}
            rows={4}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Autor colombiano, Premio Nobel..."
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Imagen (URL)" error={errors.author?.image?.message}>
            <input
              {...register('author.image')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </Field>
          <Field
            label="Fecha de nacimiento (YYYY-MM-DD)"
            error={errors.author?.birthDate?.message}
          >
            <input
              {...register('author.birthDate')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="1927-03-06"
            />
          </Field>
        </div>
      </Card>

      {/* Libro */}
      <Card title="Libro (obligatorio)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.book?.name?.message}>
            <input
              {...register('book.name')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Cien años de soledad"
            />
          </Field>
          <Field label="ISBN" error={errors.book?.isbn?.message}>
            <input
              {...register('book.isbn')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="978-..."
            />
          </Field>
          <Field label="Imagen (URL)" error={errors.book?.image?.message}>
            <input
              {...register('book.image')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </Field>
          <Field
            label="Fecha de publicación (YYYY-MM-DD)"
            error={errors.book?.publishingDate?.message}
          >
            <input
              {...register('book.publishingDate')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="1967-05-30"
            />
          </Field>
        </div>
        <Field label="Descripción" error={errors.book?.description?.message}>
          <textarea
            {...register('book.description')}
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Sinopsis del libro..."
          />
        </Field>
        <Field label="editorialId (numérico)" error={errors.book?.editorialId?.message}>
          <input
            type="number"
            {...register('book.editorialId', { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="1000"
          />
        </Field>
      </Card>

      {/* Premio */}
      <Card title="Premio (obligatorio)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre del premio" error={errors.prize?.name?.message}>
            <input
              {...register('prize.name')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Premio X"
            />
          </Field>
          <Field
            label="Fecha de premiación (YYYY-MM-DD)"
            error={errors.prize?.premiationDate?.message}
          >
            <input
              {...register('prize.premiationDate')}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="2010-01-01"
            />
          </Field>
        </div>
        <Field label="Descripción" error={errors.prize?.description?.message}>
          <textarea
            {...register('prize.description')}
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Descripción del premio..."
          />
        </Field>
        <Field
          label="organizationId (numérico)"
          error={errors.prize?.organizationId?.message}
        >
          <input
            type="number"
            {...register('prize.organizationId', { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="1000"
          />
        </Field>
      </Card>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-slate-900 text-white py-2.5 hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? 'Creando...' : 'Crear autor'}
      </button>
    </form>
  )
}
