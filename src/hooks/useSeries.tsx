// src/hooks/useSeries.ts
import { useEffect, useState } from 'react';
import type { BookSeries } from '../data/types';
import { fetchSeries } from '../data/seriesService';

export function useSeries() {
  const [data, setData] = useState<BookSeries[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSeries()
      .then(s => { if (mounted) setData(s); })
      .catch(e => { if (mounted) setError(String(e)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}