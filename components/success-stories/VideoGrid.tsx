"use client"
import { useState } from 'react'
import Image from 'next/image'
import type { VideoStory } from '@/lib/types'

function getYouTubeId(url: string): string | null {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

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
          {filtered.map((s, i) => {
            const ytId = s.youtubeUrl ? getYouTubeId(s.youtubeUrl) : null
            const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null
            const url = s.youtubeUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : null)
            return (
              <div key={i} className="video-card">
                <div className="video-thumb" style={{ background: s.gradient || '#1a1a2e', position: 'relative', overflow: 'hidden' }}>
                  {thumbnail && (
                    <Image src={thumbnail} alt={s.title || 'Video'} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
                  )}
                  {url && (
                    <a href={url} target="_blank" rel="noreferrer" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                      <div className="play-btn" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#111"><polygon points="5,3 19,12 5,21"/></svg>
                      </div>
                    </a>
                  )}
                </div>
                <div className="video-info">
                  {s.tag && <span className={`video-tag tag-${s.tagType || 'condition'}`}>{s.tag}</span>}
                  <h3 className="video-title">{s.title || s.caption || 'Patient Story'}</h3>
                  {s.description && <p className="video-desc">{s.description}</p>}
                  {s.duration && <span className="video-duration">{s.duration}</span>}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>No videos yet.</div>
          )}
        </div>
      </div>
    </section>
  )
}
