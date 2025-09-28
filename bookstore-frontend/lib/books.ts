// lib/books.ts
import { API_BASE } from './api'
import type { Book, Review, NewReviewInput, NewBookFormInput } from '@/types/book'

export async function listBooks(): Promise<Book[]> {
  const r = await fetch(`${API_BASE}/api/books`, { cache: 'no-store' })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<Book[]>
}

export async function getBook(id: number): Promise<Book> {
  const r = await fetch(`${API_BASE}/api/books/${id}`, { cache: 'no-store' })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<Book>
}

type CreateBookPayload = Omit<NewBookFormInput, 'editorialId'> & {
  editorial: { id: number };
};

export async function createBook(input: NewBookFormInput): Promise<Book> {
  const { editorialId, ...rest } = input;
  const body: CreateBookPayload = { ...rest, editorial: { id: editorialId } };

  const r = await fetch(`${API_BASE}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<Book>
}

export async function addReview(bookId: number, review: NewReviewInput): Promise<Review> {
  const r = await fetch(`${API_BASE}/api/books/${bookId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<Review>
}

export async function deleteBook(bookId: number): Promise<void> {
  const r = await fetch(`${API_BASE}/api/books/${bookId}`, { method: 'DELETE' })
  if (!r.ok) throw new Error(await r.text())
}
