import { useParams, useNavigate } from 'react-router-dom'
import { getBooksForSeries } from '../data/books'

export function BooksInSeriesPage() {
  const { seriesId } = useParams()
  const navigate = useNavigate()

  if (!seriesId) return <p>Invalid series</p>

  const books = getBooksForSeries(seriesId)

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
            <p>{book.title}</p>
          </button>
        ))}
      </div>
    </main>
  )
}
