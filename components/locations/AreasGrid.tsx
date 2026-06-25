import type { AreaItem, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function AreasGrid({ areas, clinic }: { areas: AreaItem[]; clinic?: ClinicInfo }) {
  const city = clinic?.city || 'the city'
  return (
    <section className="areas-section">
      <div className="sec-header">
        <div className="sec-label"><span>Areas We Serve</span></div>
        <h2 className="sec-title">Serving patients across {city}.</h2>
        <p className="sec-sub">Patients visit us from across the city. Here are the areas we commonly serve.</p>
      </div>
      <div className="areas-grid">
        {areas.map((a, i) => (
          <a key={i} href={`/locations/${a.slug}`} className="area-card">
            <h3>{a.name}</h3>
            <div className="area-meta">
              <span><Icon name="location" size={14} />{a.distance}</span>
              <span><Icon name="clock" size={14} />{a.duration}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
