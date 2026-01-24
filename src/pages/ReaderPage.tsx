import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSession } from '../session/SessionContext'
import { getBookContent } from '../data/getBookContents'
import { Book } from '../data/types'
import { TextPanelControls } from '../components/TextPanelControls'

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
   console.log("FETCH START:", url)
   if (!navigator.onLine) {     console.log("OFFLINE — aborting fetch")
return null}

  try {
    const response = await fetch(url, { cache: 'no-cache' })

    console.log("FETCH RESPONSE:", response.status, response.ok)

// console.log("CONTENT TYPE:", response.headers.get("content-type"))
    if (!response.ok) {
      console.log("FETCH FAILED:", response.status)
      return null
    }

    const blob = await response.blob()
    console.log("BLOB SIZE:", blob.size)

    const objectUrl = URL.createObjectURL(blob)
    console.log("OBJECT URL CREATED:", objectUrl)

    const img = new Image()
    img.src = objectUrl

    await img.decode()
    console.log("IMAGE DECODE SUCCESS")

    return objectUrl

  } catch (err) {
    console.error("FETCH ERROR:", err)
    return null
  }
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

 /* -----------------------------------------
     State
  ----------------------------------------- */

  const [imageSource, setImageSource] =
    useState<ImageSource | null>(null)
  const [retryTick, setRetryTick] = useState(0)

  if (!params.bookId || !params.page) {
    return <p>Invalid page</p>
  }

  const bookId: string = params.bookId
  const pageNumber = Number(params.page)

  if (Number.isNaN(pageNumber)) {
    return <p>Invalid page</p>
  }

 

/* -----------------------------------------
     Refs / constants
  ----------------------------------------- */
  const BUFFER_PAGES = 2
  const loadingRef = useRef<Set<number>>(new Set())

  /* -----------------------------------------
     Book data (async)
  ----------------------------------------- */
 const [book, setBook] = useState<Book | null>(null);

useEffect(() => {
  getBookContent(bookId).then(setBook);
}, [bookId]);



  /* -----------------------------------------
     Session cache (SOURCE OF TRUTH)
  ----------------------------------------- */
  const bookCache =
    session.state.books[bookId] ??
    (session.state.books[bookId] = {})

  

 
  /* -----------------------------------------
     Entry preload (pages 1–2)
  ----------------------------------------- */
  useEffect(() => {
    let cancelled = false

    async function preloadEntry() {
      if (Object.keys(bookCache).length > 0) return

      for (let i = 1; i <= 2; i++) {
       console.log("Loading page:", pageNumber)

if (!book) continue

const pageData = book.pages[i - 1]

console.log("Page data:", pageData)
if (pageData) {
  console.log("Image base path:", pageData.imageBasePath)
  console.log("Chosen image:", chooseImage(pageData.imageBasePath))
}
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
  }, [bookId, book])


  const totalPages = book?.pages.length ?? 0;
  const isEndPage = pageNumber > totalPages
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

if (!book) {
  loadingRef.current.delete(i)
  continue
}

const pageData = book.pages[i - 1]
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
  }, [pageNumber,book])

    

  /* -----------------------------------------
     Resolve CURRENT page image
  ----------------------------------------- */
  const imageSrc = bookCache[pageNumber]
console.log("imageSrc:", imageSrc)
console.log("navigator.onLine:", navigator.onLine)

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
     Load CURRENT page when missing
  ----------------------------------------- */
  useEffect(() => {
    if (!imageSrc && navigator.onLine) {
      let cancelled = false
console.log("LOAD EFFECT CHECK", {
  imageSrc,
  online: navigator.onLine,
  bookId,
  pageNumber
})

      async function loadCurrentPage() {
const pageData = book?.pages[pageNumber - 1]  
      if (!pageData) return
console.log("LOAD EFFECT CHECK inside", {
  imageSrc,
  online: navigator.onLine,
  bookId,
  pageNumber
})

        const blobUrl = await fetchAsBlobUrl(
          chooseImage(pageData.imageBasePath)
        )

        if (!blobUrl || cancelled) return

        bookCache[pageNumber] = blobUrl
        session.notify()
      }

      loadCurrentPage()

      return () => {
        cancelled = true
      }
    }
  }, [bookId, pageNumber, imageSrc])


  if (!book) return <p>Loading book…</p>;

  /* -----------------------------------------
     Render: missing current page
  ----------------------------------------- */
    if (!imageSrc) {
    if (navigator.onLine) {
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
         <div className="book-content">
        <div className="book-frame">
          <div className="page-inner">
            <div className="image-box">
              <img src={imageSrc} alt="The End" />
            </div>
            <div className="controls single-action">
              <button onClick={() => navigate(`/book/${bookId}`)}>            Read Again          </button>
            </div>
          </div>
        </div>
        </div>
      </main>
    )
  }

  /* -----------------------------------------
     NORMAL PAGE
  ----------------------------------------- */
  const pageData = book?.pages[pageNumber - 1]

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
              
              <TextPanelControls />
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
        >◀</button>

        <button
          onClick={() =>
            navigate(`/book/${bookId}/read/${pageNumber + 1}`)
          }
        >▶</button>
      </div>
    </main>
  )
}
