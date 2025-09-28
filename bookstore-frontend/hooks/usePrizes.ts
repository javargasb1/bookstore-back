import { useCallback } from 'react'
import type { Prize } from '@/types/prize'
import type { NewPrizeFormInput } from '@/types/prize'
import { API_BASE } from '@/lib/api'

export function usePrizes() {
  const createPrize = useCallback(async (input: NewPrizeFormInput) => {
    const body = { ...input, organization: { id: input.organizationId } };
    delete (body as Record<string, unknown>).organizationId;

    const res = await fetch(`${API_BASE}/api/prizes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    const created: Prize = await res.json();
    return created;
  }, []);

  const associatePrizeToAuthor = useCallback(async (prizeId: number, authorId: number) => {
    const res = await fetch(`${API_BASE}/api/prizes/${prizeId}/author/${authorId}`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
  }, []);

  return { createPrize, associatePrizeToAuthor };
}
