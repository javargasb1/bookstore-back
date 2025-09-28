// hooks/useBooks.ts
import { useCallback } from 'react'
import { useBooksStore } from '@/store/booksStore'
import type { Book, NewReviewInput, NewBookFormInput } from '@/types/book'
import type { Author as AuthorEntity } from '@/types/author'
import { API_BASE } from '@/lib/api'
import { getErrorMessage } from '@/lib/errors'

export function useBooks() {
  const {
    books, current, loading, error,
    setBooks, setCurrent, upsertBook, removeBook, setLoading, setError
  } = useBooksStore();

  const fetchAllBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/books`);
      if (!res.ok) throw new Error('No se pudo cargar libros');
      const data: Book[] = await res.json();
      setBooks(data);
      setError(null);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [setBooks, setError, setLoading]);

  const fetchBookById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/books/${id}`);
      if (!res.ok) throw new Error('No se pudo cargar el libro');
      const data: Book = await res.json();
      setCurrent(data);
      upsertBook(data);
      setError(null);
      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrent, setError, setLoading, upsertBook]);

  // Crear libro (tu API espera editorial como objeto { id })
  const createBook = useCallback(async (input: NewBookFormInput) => {
    const body = { ...input, editorial: { id: input.editorialId } };
    delete (body as Record<string, unknown>).editorialId;

    const res = await fetch(`${API_BASE}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    const created: Book = await res.json();
    upsertBook(created);
    return created;
  }, [upsertBook]);

  const addReview = useCallback(async (bookId: number, input: NewReviewInput) => {
    const res = await fetch(`${API_BASE}/api/books/${bookId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchBookById(bookId);
  }, [fetchBookById]);

  const associateBookToAuthor = useCallback(async (authorId: number, bookId: number) => {
    const res = await fetch(`${API_BASE}/api/authors/${authorId}/books/${bookId}`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
  }, []);

  // —— Borrar libros (expuesto a la UI) ——
  const deleteBook = useCallback(async (bookId: number) => {
    const res = await fetch(`${API_BASE}/api/books/${bookId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    removeBook(bookId); // actualiza store
  }, [removeBook]);

  // —— Helpers para poder borrar autores aunque tengan libros ——
  const detachBookFromAuthor = useCallback(async (authorId: number, bookId: number) => {
    const res = await fetch(`${API_BASE}/api/authors/${authorId}/books/${bookId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }, []);

  const removeAllBooksFromAuthor = useCallback(async (authorId: number) => {
    const res = await fetch(`${API_BASE}/api/authors/${authorId}`);
    if (!res.ok) throw new Error('No se pudo cargar el autor para limpiar libros');
    const author: AuthorEntity = await res.json();
    const list = author.books ?? [];

    for (const b of list) {
      try {
        await detachBookFromAuthor(authorId, b.id);
      } catch {
        // si no existe endpoint de detach, borra el libro
        await deleteBook(b.id);
      }
    }
  }, [deleteBook, detachBookFromAuthor]);

  return {
    books, current, loading, error,
    fetchAllBooks, fetchBookById, createBook, addReview, associateBookToAuthor,
    deleteBook,                 // 👈 ahora disponible para la UI
    removeAllBooksFromAuthor,   // usado antes de borrar autor
  };
}
