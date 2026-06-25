'use client'
import { useRef } from 'react'
import type { StoryItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

const storyGrads = [
  'background: linear-gradient(145deg, var(--secondary), var(--primary))',
  'background: linear-gradient(145deg, var(--secondary-deep), var(--secondary), var(--primary))',
  'background: linear-gradient(145deg, var(--primary), var(--primary-dark), var(--primary))',
  'background: linear-gradient(145deg, var(--primary-dark), var(--secondary-deep), var(--secondary))',
  'background: linear-gradient(145deg, var(--secondary-deep), var(--secondary-dark), var(--primary-dark))',
]

export default function PatientStories({ stories }: { stories: StoryItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => { ref.current?.scrollBy({ left: dir * 440, behavior: 'smooth' }) }

  return (
    <section className="stories-section-dark">
      <div className="stories-inner-dark">
        <div className="stories-header-row">
          <div>
            <div className="sec-label"><span>Real Stories</span></div>
            <h2 className="sec-title">Patient Stories</h2>
            <p className="sec-sub">Real patients sharing their treatment journey.</p>
            <a href="/success-stories" className="stories-link">
              View all stories <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
        <div className="stories-carousel-wrap">
          <button className="carousel-btn carousel-prev" aria-label="Previous" onClick={() => scroll(-1)}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </button>
          <div className="stories-carousel" ref={ref}>
            {stories.map((story, i) => (
              <div key={i} className="story-slide">
                <div className="story-video-thumb" style={{ ...(storyGrads[i] ? { background: storyGrads[i].replace('background: ', '') } : {}) }}>
                  <div className="play-circle">
                    <Icon name="play" size={24} color="#FFFFFF" weight="fill" />
                  </div>
                  <span className="vid-duration">{story.duration}</span>
                </div>
                <h3>{story.title}</h3>
                <span className="story-tag">{story.tag}</span>
              </div>
            ))}
          </div>
          <button className="carousel-btn carousel-next" aria-label="Next" onClick={() => scroll(1)}>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </section>
  )
}
