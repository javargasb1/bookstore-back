export interface Editorial { id: number; name: string; }

export interface BookLite {
  id: number;
  name: string;
  isbn: string;
  image: string;
  publishingDate: string;
  description: string;
  editorial: Editorial;
}

export interface Organization { id: number; name: string; tipo: 'PUBLICA'|'PRIVADA'|string; }

export interface PrizeLite {
  id: number;
  premiationDate: string;
  name: string;
  description: string;
  organization: Organization;
}

export interface Author {
  id: number;
  birthDate: string;
  name: string;
  description: string;
  image: string;
  books?: BookLite[];
  prizes?: PrizeLite[];
}

export type AuthorInput = {
  birthDate: string;
  name: string;
  description: string;
  image: string;
};
