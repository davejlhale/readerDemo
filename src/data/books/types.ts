export type PageMeta = {
  wordCount: number
}

export type BookPage = {
  pageNumber: number
    imageBasePath: string
  lines: string[]
  meta: PageMeta
}

export type Book = {
  id: string
  seriesId: string        
  title: string
  coverImage: string
  coverImageLandscape: string
  pages: BookPage[]
}

