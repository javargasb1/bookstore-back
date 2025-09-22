'use client'
import { useAuthors } from '@/hooks/useAuthors'
import AuthorCard from '@/components/AuthorCard'
import { getErrorMessage } from '@/lib/errors'

export default function AuthorsPage() {
  const { authors, loading, error, deleteAuthorById } = useAuthors();

  const handleDelete = async (id: number) => {
    const ok = confirm('¿Eliminar este autor?');
    if (!ok) return;
    try {
      await deleteAuthorById(id);
    } catch (e: unknown) {
      alert(getErrorMessage(e) || 'Error eliminando');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Autores</h2>
        <a href="/authors/new" className="rounded-lg bg-slate-900 text-white px-4 py-2 hover:opacity-90">
          Crear Autor
        </a>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map(a => (
          <AuthorCard key={a.id} author={a} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
}
