export interface Prize {
  id: number;
  name: string;
  organization: string;
  year: number;
}
export type PrizeInput = Omit<Prize, 'id'>;
