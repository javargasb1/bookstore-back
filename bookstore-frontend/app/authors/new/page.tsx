'use client'
import AuthorForm, { type FullPayload } from '@/components/AuthorForm'
import { useAuthors } from '@/hooks/useAuthors'
import { useBooks } from '@/hooks/useBooks'
import { usePrizes } from '@/hooks/usePrizes'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/errors'

export default function NewAuthorPage() {
  const { createAuthor } = useAuthors();
  const { createBook, associateBookToAuthor } = useBooks();
  const { createPrize, associatePrizeToAuthor } = usePrizes();
  const router = useRouter();

  const onSubmit = async (data: FullPayload) => {
    try {
      const createdAuthor = await createAuthor(data.author);

      const createdBook = await createBook({
        ...data.book,           // tiene editorialId
      });
      await associateBookToAuthor(createdAuthor.id, createdBook.id);

      const createdPrize = await createPrize({
        ...data.prize,          // tiene organizationId
      });
      await associatePrizeToAuthor(createdPrize.id, createdAuthor.id);

      router.push('/authors');
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };

  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <AuthorForm onSubmit={onSubmit} />
    </div>
  )
}
