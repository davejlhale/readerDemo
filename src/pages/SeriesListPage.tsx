import { useNavigate } from 'react-router-dom'
import { seriesData } from '../data/bookSeries/bookSeriesData'
import { SeriesCard } from '../components/BookSeriesCard'

export function SeriesListPage() {
  const navigate = useNavigate()

  function handleSeriesClick(id: string) {
    navigate(`/series/${id}`)
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Book Series</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {seriesData.map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            onClick={handleSeriesClick}
          />
        ))}
      </div>
    </main>
  )
}
