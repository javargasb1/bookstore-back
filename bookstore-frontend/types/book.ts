import type { Editorial } from './author'

export interface Review {
  id: number;
  name: string;
  source: string;
  description: string;
}

export interface Book {
  id: number;
  name: string;
  isbn: string;
  image: string;
  publishingDate: string;
  description: string;
  editorial: Editorial;
  reviews?: Review[];
  authors?: { id: number; birthDate: string; name: string; description: string; image: string }[];
}

export type NewReviewInput = {
  name: string;
  source: string;
  description: string;
};

export type NewBookFormInput = {
  name: string;
  isbn: string;
  image: string;
  publishingDate: string;
  description: string;
  editorialId: number;
};
