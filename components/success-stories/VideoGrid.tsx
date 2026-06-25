"use client"
import { useState } from 'react'
import type { VideoStory } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function VideoGrid({ stories, conditions: conditionsProp }: { stories: VideoStory[], conditions?: any[] }) {
  const conditions = (conditionsProp || []).slice(0, 5)
  const conditionFilters = conditions.map((c: any) => ({ label: c.title || c.label, value: c.slug || (c.label || '').toLowerCase().replace(/\s+/g, '-') }))
  const filters = [{ label: 'All Stories', value: 'all' }, ...conditionFilters]
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? stories : stories.filter(s => s.category === active)

  return (
    <section className="videos-section">
      <div className="videos-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Patient Journeys</span></div>
          <h2 className="sec-title">Watch their stories.</h2>
          <p className="sec-sub">Filter by condition or procedure to find stories most relevant to you.</p>
        </div>
        <div className="filter-bar">
          {filters.map(f => (
            <button key={f.value} className={`filter-tab${active === f.value ? ' active' : ''}`} onClick={() => setActive(f.value)}>{f.label}</button>
          ))}
        </div>
        <div className="video-grid">
          {filtered.map((s, i) => (
            <div key={i} className="video-card">
              <div className="video-thumb" style={{ background: s.gradient }}>
                <div className="play-btn">
                  <Icon name="play" size={20} color="#FFFFFF" weight="fill" />
                </div>
                {s.duration && <span className="video-duration">{s.duration}</span>}
              </div>
              <div className="video-info">
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
