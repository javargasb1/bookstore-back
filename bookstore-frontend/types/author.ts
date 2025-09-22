// types/author.ts
export interface Author {
  id: number;
  name: string;
  description: string;
  image: string;      // URL
  birthDate: string;  // ISO (YYYY-MM-DD)
}

export type NewAuthor = Omit<Author, 'id'>;

export type AuthorInput = {
  name: string;
  description: string;
  image: string;
  birthDate: string;
};
