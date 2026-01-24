import type { Book } from './types';

export async function getBook(bookId: string): Promise<Book | null> {
  const url = `/data/jsonFiles/Hugo_Pip_Books_Content/${bookId}.json`;
console.log('fetching booId', bookId, url);
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    return (await res.json()) as Book;
  } catch {
    return null;
  }
}
