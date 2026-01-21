import { Routes, Route } from 'react-router-dom'
import { SeriesListPage } from './pages/SeriesListPage'
import { BooksInSeriesPage } from './pages/BooksInSeriesPage'
import { BookCoverPage } from './pages/BookCoverPage'
import { ReaderPage } from './pages/ReaderPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeriesListPage />} />
      <Route path="/series/:seriesId" element={<BooksInSeriesPage />} />
      <Route path="/book/:bookId" element={<BookCoverPage />} />
      <Route path="/book/:bookId/read/:page" element={<ReaderPage />} />
    </Routes>
  )
}

export default App
