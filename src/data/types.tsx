// src/data/types.ts
export type BookSeries = {
  id: string;
  name: string;
  stageRange?: string;
  image?: string;
  jsonPath: string;
};
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

export type BookMeta = {
  id: string
  seriesId: string        
  title: string
  coverImage: string
  contentIndex: number
}
