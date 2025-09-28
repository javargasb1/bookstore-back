'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useBooks } from '@/hooks/useBooks'
import ReviewForm from '@/components/ReviewForm'
import type { NewReviewInput } from '@/types/book'
import { getErrorMessage } from '@/lib/errors'

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { current, loading, error, fetchBookById, addReview } = useBooks();

  useEffect(() => { void fetchBookById(id); }, [fetchBookById, id]);

  const onAddReview = async (data: NewReviewInput) => {
    try { await addReview(id, data); }
    catch (e: unknown) { alert(getErrorMessage(e)); }
  };

  if (loading && !current) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!current) return <p>No encontrado</p>;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative w-full aspect-[4/3]">
          <Image src={current.image || '/placeholder.png'} alt={current.name} fill className="object-cover rounded-xl"/>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{current.name}</h1>
          <p className="text-sm text-slate-600">{new Date(current.publishingDate).toLocaleDateString()}</p>
          <p className="mt-3 text-slate-800">{current.description}</p>
          <p className="mt-1 text-sm text-slate-700">ISBN: {current.isbn}</p>
          <p className="mt-1 text-sm text-slate-700">Editorial: {current.editorial?.name ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <div className="space-y-3">
            {(current.reviews ?? []).map(r => (
              <div key={r.id} className="bg-white rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.name || 'Anónimo'}</p>
                  <span className="text-xs text-slate-500">{r.source || '—'}</span>
                </div>
                <p className="text-slate-700">{r.description}</p>
              </div>
            ))}
            {(!current.reviews || current.reviews.length === 0) && <p className="text-slate-600">Sin reviews todavía.</p>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Agregar review</h3>
          <ReviewForm onSubmit={onAddReview} />
        </div>
      </div>
    </section>
  );
}
