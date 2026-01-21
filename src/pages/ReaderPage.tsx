import { useParams, useNavigate } from 'react-router-dom'
import { getBookPage } from '../data/getBookPage'
import { getBook } from '../data/books'
import { useEffect, useState } from 'react'
import { FontSizeControls } from '../components/FontSizeControls'
import { WordSpacingControls } from '../components/WordSpacingControls'


export function ReaderPage() {
  const { bookId, page } = useParams()
  const navigate = useNavigate()
const [fontSize, setFontSize] = useState(1.4); // rem units
const [wordSpacing, setWordSpacing] = useState<number>(0.1); // em units
useEffect(() => {
  document.documentElement.style.setProperty(
    "--reader-word-spacing",
    `${wordSpacing}em`
  );
}, [wordSpacing]);
useEffect(() => {
  document.documentElement.style.setProperty(
    '--reader-font-size',
    `${fontSize}rem`
  );
}, [fontSize]);
  if (!bookId || !page) return <p>Invalid page</p>

  const pageNumber = Number(page)
  const book = getBook(bookId)
  if (!book) return <p>Book not found</p>

  const totalPages = book.pages.length
  const isEndPage = pageNumber > totalPages

  // 🔒 END PAGE — no pageData exists
  if (isEndPage) {
    return (
      <main className="page">
        <div className="book-content">
          <div className="book-frame">
            <div className="page-inner">
              <div className="image-box">
                <img
                  src="/images/books/Generic_End_Page.png"
                  alt="The End"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="controls ">
          <button onClick={() => navigate(`/book/${bookId}`)}>
            Read Again
          </button>
        </div>
      </main>
    )
  }

  // 🔒 NORMAL PAGE — pageData MUST exist
  const pageData = getBookPage(bookId, pageNumber)
  if (!pageData) return <p>Page not found</p>

  return (
    <main className="page">
      <div className="book-content">
        <div className="book-frame">
          <div className="page-inner">
            <div className="image-box">
              

              <picture>
  <source
    srcSet={`${pageData.imageBasePath}L.png`}
    media="(min-aspect-ratio: 16/10)"
  />
  <img
    src={`${pageData.imageBasePath}.png`}
    alt={`Page ${pageNumber}`}
  />
</picture>

            </div>

            <div className="text-box">
              <div className="font-controls">
              <FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
              <WordSpacingControls
  wordSpacing={wordSpacing}
  setWordSpacing={setWordSpacing}
/></div>
              <div className='text-inner'>
              {pageData.lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={() => {
            if (pageNumber <= 1) {
              navigate(`/book/${bookId}`)
            } else {
              navigate(`/book/${bookId}/read/${pageNumber - 1}`)
            }
          }}
        >
          ◀ Previous
        </button>

        <button
          onClick={() =>
            navigate(`/book/${bookId}/read/${pageNumber + 1}`)
          }
        >
          Next ▶
        </button>
      </div>
    </main>
  )
}
