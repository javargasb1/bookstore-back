'use client'
import { useEffect, useState } from 'react'
import type { Author, AuthorInput } from '@/types/author'
import { API_BASE } from '@/lib/api'
import { useAuthors } from '@/hooks/useAuthors'
import { useParams, useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/errors'

export default function EditAuthorPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { updateAuthorById } = useAuthors();

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/authors/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar el autor');
        const data: Author = await res.json();
        setAuthor(data);
      } catch (e: unknown) {
        setErr(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (data: AuthorInput) => {
    try {
      await updateAuthorById(id, data);
      router.push('/authors');
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!author) return <p>No encontrado</p>;

  // Reutilizamos AuthorForm solo con la sección de Autor:
  // puedes crear una variante simple si prefieres.
  // Aquí dejo un mini-form rápido:
  return (
    <form onSubmit={(e) => { e.preventDefault(); void onSubmit({
      name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
      description: (e.currentTarget.elements.namedItem('description') as HTMLInputElement).value,
      image: (e.currentTarget.elements.namedItem('image') as HTMLInputElement).value,
      birthDate: (e.currentTarget.elements.namedItem('birthDate') as HTMLInputElement).value,
    })}} className="max-w-xl bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Editar Autor</h2>
      <input name="name" defaultValue={author.name} className="w-full rounded-lg border px-3 py-2"/>
      <textarea name="description" defaultValue={author.description} rows={4} className="w-full rounded-lg border px-3 py-2"/>
      <input name="image" defaultValue={author.image} className="w-full rounded-lg border px-3 py-2"/>
      <input name="birthDate" defaultValue={author.birthDate} className="w-full rounded-lg border px-3 py-2"/>
      <button className="w-full rounded-lg bg-slate-900 text-white py-2">Guardar</button>
    </form>
  );
}
