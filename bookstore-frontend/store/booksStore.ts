// store/booksStore.ts
import { create } from 'zustand'
import type { Book } from '@/types/book'

type State = {
  books: Book[];
  current: Book | null;
  loading: boolean;
  error: string | null;
}
type Actions = {
  setBooks: (v: Book[]) => void;
  setCurrent: (v: Book | null) => void;
  upsertBook: (b: Book) => void;
  removeBook: (id: number) => void;   // 👈 NUEVO
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}

export const useBooksStore = create<State & Actions>((set) => ({
  books: [],
  current: null,
  loading: false,
  error: null,

  setBooks: (v) => set({ books: v }),
  setCurrent: (v) => set({ current: v }),
  upsertBook: (b) =>
    set((s) => {
      const exists = s.books.some(x => x.id === b.id);
      return { books: exists ? s.books.map(x => x.id === b.id ? b : x) : [b, ...s.books] }
    }),
  removeBook: (id) =>
    set((s) => ({
      books: s.books.filter(b => b.id !== id),
      current: s.current?.id === id ? null : s.current,
    })),

  setLoading: (v) => set({ loading: v }),
  setError: (v) => set({ error: v }),
}));
