// store/authorsStore.ts
import { create } from 'zustand'
import type { Author } from '@/types/author'

type State = {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

type Actions = {
  setAuthors: (authors: Author[]) => void;
  addAuthor: (a: Author) => void;
  updateAuthor: (a: Author) => void;
  removeAuthor: (id: number) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useAuthorsStore = create<State & Actions>((set) => ({
  authors: [],
  loading: false,
  error: null,
  setAuthors: (authors) => set({ authors }),
  addAuthor: (a) => set((s) => ({ authors: [a, ...s.authors] })),
  updateAuthor: (a) => set((s) => ({
    authors: s.authors.map(x => x.id === a.id ? a : x)
  })),
  removeAuthor: (id) => set((s) => ({
    authors: s.authors.filter(x => x.id !== id)
  })),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e })
}));
