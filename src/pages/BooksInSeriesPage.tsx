import { useParams, useNavigate } from 'react-router-dom'
import { getBooksForSeries } from '../data/getBooksForSeries'
import { useEffect, useState } from 'react';
import { BookMeta } from '../data/types';

export function BooksInSeriesPage() {
  const { seriesId } = useParams()
  const navigate = useNavigate()
  console.log('BooksInSeriesPage for seriesId:', seriesId)

  const [books, setBooks] = useState<BookMeta[]>([]);
  if (!seriesId) return <p>Invalid series</p>

    useEffect(() => {
    if (!seriesId) return;

    getBooksForSeries(seriesId).then(setBooks);
  }, [seriesId]);

  if (!seriesId) return <p>Invalid series</p>;
  if (!books.length) return <p>Loading books…</p>;


  return (
    <main style={{ padding: '2rem' }}>
      <h1>Books</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {books.map(book => (
          <button
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </button>
        ))}
      </div>
    </main>
  )
}
