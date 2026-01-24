import type { Book } from './types'

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
