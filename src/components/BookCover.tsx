type Props = {
  image: string
  title: string
  onClick: () => void
}

export function BookCover({ image, title, onClick }: Props) {
  return (
    <button className="book-cover" onClick={onClick} aria-label={`Read ${title}`}>
      <img src={image} alt={`Cover of ${title}`} />
    </button>
  )
}
