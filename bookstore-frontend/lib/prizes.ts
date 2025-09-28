// lib/prizes.ts
import { API_BASE } from './api'
import type { Prize, NewPrizeFormInput } from '@/types/prize'

// Payload que espera tu API al crear un premio:
// { premiationDate, name, description, organization: { id } }
type CreatePrizePayload = Omit<NewPrizeFormInput, 'organizationId'> & {
  organization: { id: number };
};

export async function createPrize(input: NewPrizeFormInput): Promise<Prize> {
  const { organizationId, ...rest } = input;
  const body: CreatePrizePayload = {
    ...rest,
    organization: { id: organizationId },
  };

  const r = await fetch(`${API_BASE}/api/prizes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<Prize>;
}

// Asociar premio a un autor
export async function associatePrizeToAuthor(prizeId: number, authorId: number): Promise<void> {
  const r = await fetch(`${API_BASE}/api/prizes/${prizeId}/author/${authorId}`, {
    method: 'POST',
  });
  if (!r.ok) throw new Error(await r.text());
}

// (Opcional) eliminar premio
export async function deletePrize(prizeId: number): Promise<void> {
  const r = await fetch(`${API_BASE}/api/prizes/${prizeId}`, { method: 'DELETE' });
  if (!r.ok) throw new Error(await r.text());
}
