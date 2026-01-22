export type BookImageCache = Record<number, string>

export type SessionState = {
  books: Record<string, BookImageCache>
}

export const sessionState: SessionState = {
  books: {},
}