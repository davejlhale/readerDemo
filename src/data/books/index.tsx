import type { Book } from './types'
import { GoToTheZoo } from './HugoAndPip/GoToTheZoo'

const books: Book[] = [
  GoToTheZoo,
]

export function getBooksForSeries(seriesId: string): Book[] {
  return books.filter(book => book.seriesId === seriesId)
}

export function getBook(bookId: string): Book | null {
  return books.find(book => book.id === bookId) ?? null
}
