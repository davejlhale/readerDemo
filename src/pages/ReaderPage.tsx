import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { getBook } from '../data/books'
import { getBookPage } from '../data/getBookPage'

import { FontSizeControls } from '../components/FontSizeControls'
import { WordSpacingControls } from '../components/WordSpacingControls'

import { useSession } from '../session/SessionContext'

/* ---------------------------------------------
   Types
--------------------------------------------- */
type ImageSource = 'network' | 'blob'

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function chooseImage(basePath: string): string {
  const wide = window.matchMedia('(min-aspect-ratio: 16/10)').matches
  return wide ? `${basePath}L.png` : `${basePath}.png`
}

function yieldToBrowser() {
  return new Promise<void>(resolve =>
    requestAnimationFrame(() => resolve())
  )
}

async function fetchAsBlobUrl(url: string): Promise<string | null> {
  if (!navigator.onLine) return null

  const response = await fetch(url, { cache: 'no-cache' })
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  const img = new Image()
  img.src = objectUrl
  await img.decode()

  return objectUrl
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function ReaderPage() {
  /* -----------------------------------------
     Routing / session
  ----------------------------------------- */
  const params = useParams()
  const navigate = useNavigate()
  const session = useSession()

  if (!params.bookId || !params.page) {
    return <p>Invalid page</p>
  }

  const bookId: string = params.bookId
  const pageNumber = Number(params.page)

  if (Number.isNaN(pageNumber)) {
    return <p>Invalid page</p>
  }

  /* -----------------------------------------
     State
  ----------------------------------------- */
  const [fontSize, setFontSize] = useState(1.4)
  const [wordSpacing, setWordSpacing] = useState(0.1)

  const [imageSource, setImageSource] =
    useState<ImageSource | null>(null)

  const [retryTick, setRetryTick] = useState(0)

  /* -----------------------------------------
     Book data
  ----------------------------------------- */
  const book = getBook(bookId)
  if (!book) return <p>Book not found</p>

  const totalPages = book.pages.length
  const isEndPage = pageNumber > totalPages

  /* -----------------------------------------
     Session cache (SOURCE OF TRUTH)
  ----------------------------------------- */
  const bookCache =
    session.state.books[bookId] ??
    (session.state.books[bookId] = {})

  /* -----------------------------------------
     Refs / constants
  ----------------------------------------- */
  const BUFFER_PAGES = 2
  const loadingRef = useRef<Set<number>>(new Set())

  /* -----------------------------------------
     DEV: PURGE BLOBS ON ENTRY (optional)
  ----------------------------------------- */
  // useEffect(() => {
  //   Object.values(session.state.books).forEach(book =>
  //     Object.values(book).forEach(url => {
  //       URL.revokeObjectURL(url)
  //     })
  //   )
  //   session.state.books = {}
  //   session.notify()
  //   console.warn('[ReaderPage] Blob cache purged on entry')
  // }, [])

  /* -----------------------------------------
     Entry preload (pages 1–2)
  ----------------------------------------- */
  useEffect(() => {
    let cancelled = false

    async function preloadEntry() {
      if (Object.keys(bookCache).length > 0) return

      for (let i = 1; i <= 2; i++) {
        const pageData = getBookPage(bookId, i)
        if (!pageData) continue

        loadingRef.current.add(i)

        const blobUrl = await fetchAsBlobUrl(
          chooseImage(pageData.imageBasePath)
        )

        if (blobUrl) {
          setImageSource('network')
        }

        loadingRef.current.delete(i)

        if (!blobUrl || cancelled) return

        bookCache[i] = blobUrl
        session.notify()
        await yieldToBrowser()
      }
    }

    preloadEntry()
    return () => {
      cancelled = true
    }
  }, [bookId])

  /* -----------------------------------------
     Background prefetch (future pages only)
  ----------------------------------------- */
  useEffect(() => {
    if (!navigator.onLine) return

    let cancelled = false

    async function prefetchAhead() {
      const start = pageNumber + 1
      const end = Math.min(pageNumber + BUFFER_PAGES, totalPages + 1)

      for (let i = start; i <= end; i++) {
        if (cancelled) return
        if (bookCache[i]) continue
        if (loadingRef.current.has(i)) continue

        loadingRef.current.add(i)

        try {
          if (i === totalPages + 1) {
            const blob = await fetchAsBlobUrl(
              '/images/books/Generic_End_Page.png'
            )
            if (blob) {
              bookCache[i] = blob
              session.notify()
            }
            loadingRef.current.delete(i)
            continue
          }

          const pageData = getBookPage(bookId, i)
          if (!pageData) {
            loadingRef.current.delete(i)
            continue
          }

          const blobUrl = await fetchAsBlobUrl(
            chooseImage(pageData.imageBasePath)
          )

          if (!blobUrl || cancelled) {
            loadingRef.current.delete(i)
            return
          }

          bookCache[i] = blobUrl
          session.notify()
          await yieldToBrowser()
          loadingRef.current.delete(i)
        } catch {
          loadingRef.current.delete(i)
        }
      }
    }

    prefetchAhead()
    return () => {
      cancelled = true
    }
  }, [pageNumber])

    useEffect(() => {
  document.documentElement.style.setProperty(
    '--reader-font-size',
    `${fontSize}rem`
  )
}, [fontSize])
useEffect(() => {
  document.documentElement.style.setProperty(
    '--reader-word-spacing',
    `${wordSpacing}em`
  )
}, [wordSpacing])

  /* -----------------------------------------
     Resolve CURRENT page image
  ----------------------------------------- */
  const imageSrc = bookCache[pageNumber]
  const isLoadingThisPage = loadingRef.current.has(pageNumber)

  /* -----------------------------------------
     Track source when blob is used
  ----------------------------------------- */
  useEffect(() => {
    if (imageSrc) {
      setImageSource('blob')
    }
  }, [imageSrc])

  /* -----------------------------------------
     Auto-retry when connection returns
  ----------------------------------------- */
  useEffect(() => {
    if (navigator.onLine) return

    const interval = setInterval(() => {
      if (navigator.onLine) {
        setRetryTick(t => t + 1)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [pageNumber, retryTick])

  /* -----------------------------------------
     Debug logging
  ----------------------------------------- */
  useEffect(() => {
    console.log(
      '[ReaderPage]',
      'page',
      pageNumber,
      'source',
      imageSource
    )
  }, [pageNumber, imageSource])

  /* -----------------------------------------
     Render: missing current page
  ----------------------------------------- */
  if (!imageSrc) {
    if (navigator.onLine) {
      if (!isLoadingThisPage) {
        loadingRef.current.add(pageNumber)

        ;(async () => {
          const pageData = getBookPage(bookId, pageNumber)
          if (!pageData) {
            loadingRef.current.delete(pageNumber)
            return
          }

          const blobUrl = await fetchAsBlobUrl(
            chooseImage(pageData.imageBasePath)
          )

          loadingRef.current.delete(pageNumber)

          if (!blobUrl) return

          bookCache[pageNumber] = blobUrl
          session.notify()
        })()
      }

      return (
        <main className="page page-loading">
          <p>Loading page…</p>
        </main>
      )
    }

    return (
      <main className="page">
        <p style={{ padding: '2rem', textAlign: 'center' }}>
          This page isn’t available offline yet.
        </p>
        <div className="controls single-action">
          <button onClick={() => navigate(`/book/${bookId}`)}>
            Back to book
          </button>
        </div>
      </main>
    )
  }

  /* -----------------------------------------
     END PAGE
  ----------------------------------------- */
  if (isEndPage) {
    return (
      <main className="page">
        <img src={imageSrc} alt="The End" />
        <div className="controls single-action">
          <button onClick={() => navigate(`/book/${bookId}`)}>
            Read Again
          </button>
        </div>
      </main>
    )
  }

  /* -----------------------------------------
     NORMAL PAGE
  ----------------------------------------- */
  const pageData = getBookPage(bookId, pageNumber)
  if (!pageData) return <p>Page not found</p>

  return (
    <main className="page">
      <div className="book-content">
        <div className="book-frame">
          <div className="page-inner">
            <div className="image-box">
              <img src={imageSrc} alt={`Page ${pageNumber}`} />
            </div>

            <div className="text-box">
              <FontSizeControls
                fontSize={fontSize}
                setFontSize={setFontSize}
              />
              <WordSpacingControls
                wordSpacing={wordSpacing}
                setWordSpacing={setWordSpacing}
              />
              <div className="text-inner">
                {pageData.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={() =>
            pageNumber <= 1
              ? navigate(`/book/${bookId}`)
              : navigate(`/book/${bookId}/read/${pageNumber - 1}`)
          }
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
