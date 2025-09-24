import { API_BASE } from './api'
import type { Book, BookInput, Review, ReviewInput } from '@/types/book'

export async function listBooks(): Promise<Book[]> {
  const r = await fetch(`${API_BASE}/books`);
  if (!r.ok) throw new Error(`Error ${r.status} listando libros`);
  return r.json();
}

export async function getBook(id: number): Promise<Book & { reviews?: Review[] }> {
  const r = await fetch(`${API_BASE}/books/${id}`);
  if (!r.ok) throw new Error(`Error ${r.status} cargando libro`);
  return r.json();
}

export async function createBook(input: BookInput): Promise<Book> {
  const r = await fetch(`${API_BASE}/books`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error(await r.text().catch(()=> 'Error creando libro'));
  return r.json();
}

export async function linkBookToAuthor(authorId: number, bookId: number): Promise<void> {
  const r = await fetch(`${API_BASE}/authors/${authorId}/books/${bookId}`, { method: 'POST' });
  if (!r.ok) throw new Error(await r.text().catch(()=> 'Error asociando libro a autor'));
}

export async function createReview(bookId: number, input: ReviewInput): Promise<Review> {
  const r = await fetch(`${API_BASE}/books/${bookId}/reviews`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error(await r.text().catch(()=> 'Error creando review'));
  return r.json();
}
