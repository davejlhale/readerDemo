import type { BookSeries } from '../data/bookSeries/bookSeriesData'

type Props = {
  series: BookSeries
  onClick: (id: string) => void
}

export function SeriesCard({ series, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(series.id)}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'left',
        cursor: 'pointer',
        background: 'white',
      }}
    >
      <img
        src={series.image}
        alt={series.name}
        style={{ width: '100%', borderRadius: '4px' }}
      />

      <h2>{series.name}</h2>
      <p>{series.stageRange}</p>
    </button>
  )
}
