import { useEffect, useCallback } from 'react'
import { useAuthorsStore } from '@/store/authorsStore'
import type { Author, AuthorInput } from '@/types/author'
import { API_BASE } from '@/lib/api'
import { getErrorMessage } from '@/lib/errors'

export function useAuthors() {
  const { authors, loading, error, setAuthors, addAuthor, updateAuthor, removeAuthor, setLoading, setError } = useAuthorsStore();

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/authors`);
      if (!res.ok) throw new Error('No se pudo cargar autores');
      const data: Author[] = await res.json();
      setAuthors(data);
      setError(null);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [setAuthors, setError, setLoading]);

  const createAuthor = useCallback(async (input: AuthorInput) => {
    const res = await fetch(`${API_BASE}/api/authors`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(await res.text());
    const created: Author = await res.json();
    addAuthor(created);
    return created;
  }, [addAuthor]);

  const updateAuthorById = useCallback(async (id: number, input: AuthorInput) => {
    const res = await fetch(`${API_BASE}/api/authors/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(await res.text());
    const updated: Author = await res.json();
    updateAuthor(updated);
    return updated;
  }, [updateAuthor]);

  const deleteAuthorById = useCallback(async (id: number) => {
    const res = await fetch(`${API_BASE}/api/authors/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    removeAuthor(id);
  }, [removeAuthor]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  return { authors, loading, error, fetchAll, createAuthor, updateAuthorById, deleteAuthorById };
}
