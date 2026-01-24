// src/data/seriesService.ts
import type { BookSeries } from './types';

const SERIES_URL = '/data/jsonFiles/bookSeriesMeta.json'; // put your JSON at public/data/series.json
const cache = { series: null as BookSeries[] | null };

export async function fetchSeries(): Promise<BookSeries[]> {
  if (cache.series) return cache.series;
  const res = await fetch(SERIES_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load series: ${res.status}`);
  const data = (await res.json()) as BookSeries[];
  cache.series = data;
  console.log('Fetched series data:', data);
  return data;
}

export function clearSeriesCache() {
  cache.series = null;
}