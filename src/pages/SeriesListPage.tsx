import { useNavigate } from 'react-router-dom'
import { SeriesCard } from '../components/BookSeriesCard'
import { useSeries } from '../hooks/useSeries'
export function SeriesListPage() {
  const navigate = useNavigate()
  const { data: seriesData, loading, error } = useSeries();

  function handleSeriesClick(id: string) {
    console.log('Series clicked:', id);
    navigate(`/series/${id}`)
  }
if (loading) return <main style={{ padding: '2rem' }}><p>Loading series…</p></main>;
  if (error) return <main style={{ padding: '2rem' }}><p>Error loading series: {error}</p></main>;
  if (!seriesData || seriesData.length === 0) return <main style={{ padding: '2rem' }}><p>No series found</p></main>;


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
