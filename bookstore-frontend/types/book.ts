export interface Book {
  id: number;
  title: string;
  image: string;
  description: string;
  publicationDate: string; // YYYY-MM-DD
}
export type BookInput = Omit<Book, 'id'>;

export interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;   // 1..5
  createdAt: string; // ISO
}
export type ReviewInput = Omit<Review, 'id' | 'createdAt'>;
