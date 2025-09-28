export interface Prize {
  id: number;
  premiationDate: string;
  name: string;
  description: string;
  organization: { id: number; name: string; tipo: string };
  author?: { id: number; birthDate: string; name: string; description: string; image: string };
}

export type NewPrizeFormInput = {
  premiationDate: string;
  name: string;
  description: string;
  organizationId: number;
};
