import { getBook } from './getBooksForSeries'
import type { BookPage } from './types'

export function getBookPage(
  bookId: string,
  pageNumber: number
): BookPage | null {
  const book = getBook(bookId)
  if (!book) return null

  return book.pages.find(
    (page) => page.pageNumber === pageNumber
  ) ?? null
}

export function getBookMeta(bookId: string) {
  const book = getBook(bookId)
  if (!book) return null

  return {
    totalPages: book.pages.length,
    title: book.title,
  }
}