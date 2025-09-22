// hooks/useAuthors.ts
import { useEffect, useCallback } from 'react'
import { useAuthorsStore } from '@/store/authorsStore'
import type { Author, AuthorInput } from '@/types/author'
import { api, API_BASE } from '@/lib/api'
import { getErrorMessage } from '@/lib/errors'

export function useAuthors() {
  const {
    authors,
    loading,
    error,
    setAuthors,
    addAuthor,
    updateAuthor,
    removeAuthor,
    setLoading,
    setError,
  } = useAuthorsStore();

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api<Author[]>('/api/authors');
      setAuthors(data);
      setError(null);
    } catch (e: unknown) {
      setError(getErrorMessage(e) ?? 'Error fetching authors');
    } finally {
      setLoading(false);
    }
  }, [setAuthors, setLoading, setError]);

  const createAuthor = useCallback(async (input: AuthorInput) => {
    const res = await fetch(`${API_BASE}/api/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Error creating author');
    }
    const created: Author = await res.json();
    addAuthor(created);
    return created;
  }, [addAuthor]);

  const updateAuthorById = useCallback(async (id: number, input: AuthorInput) => {
    const res = await fetch(`${API_BASE}/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Error updating author');
    }
    const updated: Author = await res.json();
    updateAuthor(updated);
    return updated;
  }, [updateAuthor]);

  const deleteAuthorById = useCallback(async (id: number) => {
    const res = await fetch(`${API_BASE}/api/authors/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Error deleting author');
    }
    removeAuthor(id);
  }, [removeAuthor]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  return {
    authors,
    loading,
    error,
    fetchAll,
    createAuthor,
    updateAuthorById,
    deleteAuthorById,
  };
}
