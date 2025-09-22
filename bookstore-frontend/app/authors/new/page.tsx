// app/authors/new/page.tsx
'use client'
import AuthorForm from '@/components/AuthorForm'
import { useAuthors } from '@/hooks/useAuthors'
import { useRouter } from 'next/navigation'
import type { AuthorInput } from '@/types/author'

export default function NewAuthorPage() {
  const { createAuthor } = useAuthors();
  const router = useRouter();

  const onSubmit = async (data: AuthorInput) => {
    await createAuthor(data);
    router.push('/authors');
  };

  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <AuthorForm onSubmit={onSubmit} submitLabel="Crear autor" />
    </div>
  )
}
