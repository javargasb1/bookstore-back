'use client'
import { useEffect, useState } from 'react'
import AuthorForm from '@/components/AuthorForm'
import { useAuthors } from '@/hooks/useAuthors'
import type { Author, AuthorInput } from '@/types/author'
import { API_BASE } from '@/lib/api'
import { useRouter, useParams } from 'next/navigation'
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
      alert(getErrorMessage(e) || 'Error guardando');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!author) return <p>No encontrado</p>;

  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <AuthorForm defaultValues={author} onSubmit={onSubmit} submitLabel="Guardar cambios" />
    </div>
  );
}
