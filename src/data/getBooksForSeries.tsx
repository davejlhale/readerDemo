import type { Book } from './types'
import { GoToTheZoo } from './books/HugoAndPip/GoToTheZoo'

const books: Book[] = [
  GoToTheZoo,
]



export function getBook(bookId: string): Book | null {
  return books.find(book => book.id === bookId) ?? null
}


//all above to go eventually
import type { BookMeta} from './types';
export async function getBooksForSeries(seriesId: string): Promise<BookMeta[]> {
  // Build the path based on the seriesId
  const url = `/data/jsonFiles/${seriesId}_Books.json`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    console.error(`Failed to load books for series ${seriesId}:`, res.status);
    return [];
  }
console.log(`Fetched books for series ${seriesId}:`, res);
  return res.json();
}
