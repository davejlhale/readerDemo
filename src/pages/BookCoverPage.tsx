import { useParams, useNavigate } from 'react-router-dom'
import { getBook } from '../data/books'
// import '../styles/book.css'
import '../styles/readingBookUI.css'

export function BookCoverPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()

  if (!bookId) {
    return <p>Invalid book</p>
  }

  const book = getBook(bookId)

  if (!book) {
    return <p>Book not found</p>
  }

  return (
    <main className="page">
      {/* BOOK CONTENT */}
      <div className="book-content">
        <div
          className="book-frame"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/book/${bookId}/read/1`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(`/book/${bookId}/read/1`)
            }
          }}
        >
          <div className="page-inner">
            <div className="image-box">
            
              
               <picture>
  <source
    srcSet={book.coverImageLandscape}
    media="(min-aspect-ratio: 16/10)"
  />
  <img
    src={book.coverImage}
    alt={`Cover of ${book.title}`}
  />
</picture>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls single-action">
        <button onClick={() => navigate(`/book/${bookId}/read/1`)}>
          Let’s read
        </button>
      </div>
    </main>
  )
}

