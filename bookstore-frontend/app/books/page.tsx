// app/books/page.tsx
'use client'
import { useEffect } from 'react'
import { useBooks } from '@/hooks/useBooks'
import BookCard from '@/components/BookCard'
import { getErrorMessage } from '@/lib/errors'

export default function BooksPage() {
  const { books, loading, error, fetchAllBooks, deleteBook } = useBooks();

  useEffect(() => { void fetchAllBooks(); }, [fetchAllBooks]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este libro de forma permanente?')) return;
    try {
      await deleteBook(id);
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Libros</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(b => <BookCard key={b.id} book={b} onDelete={handleDelete} />)}
      </div>
    </section>
  )
}
