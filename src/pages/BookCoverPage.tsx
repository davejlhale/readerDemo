import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBook } from '../data/getBook';
import '../styles/readingBookUI.css';
import { Book } from '../data/types';

export function BookCoverPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

 // state
const [book, setBook] = useState<Book | null>(null)
console.log('BookCoverPage for bookId:', bookId,book)
// effect
useEffect(() => {
  if (!bookId) return
  getBook(bookId).then(setBook)
}, [bookId])


  if (!bookId) return <p>Invalid book</p>;
  //error needs handling


  if (!book) return <p>Loading book…</p>;
// error if never loads needs handling


  return (
    <main className="page">
      <div className="book-content">
        <div
          className="book-frame"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/book/${bookId}/read/1`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(`/book/${bookId}/read/1`);
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

      <div className="controls single-action">
        <button onClick={() => navigate(`/book/${bookId}/read/1`)}>
          Let’s read
        </button>
      </div>
    </main>
  );
}