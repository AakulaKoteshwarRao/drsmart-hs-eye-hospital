'use client'
import { useRef } from 'react'
import type { BlogPost } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => { ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' }) }

  return (
    <section className="blog-section-scroll">
      <div className="blog-scroll-inner">
        <div className="blog-header-row">
          <div>
            <div className="sec-label"><span>Health Blog</span></div>
            <h2 className="sec-title">Read. Learn. Take better care.</h2>
          </div>
          <a href="/blog" className="blog-view-all">
            View all posts <Icon name="arrow-right" size={16} />
          </a>
        </div>
        <div className="blog-carousel-wrap">
          <button className="carousel-btn blog-prev" aria-label="Previous" style={{ left: -16, top: '50%', transform: 'translateY(-50%)' }} onClick={() => scroll(-1)}>
            <Icon name="arrow-left" size={20} color="#374151" />
          </button>
          <div className="blog-carousel" ref={ref}>
            {posts.map((post, i) => (
              <a key={i} href={post.href} className="blog-slide">
                <div className="blog-slide-thumb" style={{ background: post.gradStyle.replace('background: ', '') }}>
                  <Icon name="file" size={40} color="rgba(255,255,255,0.4)" />
                </div>
                <div className="blog-slide-body">
                  <span className="blog-slide-date">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
          <button className="carousel-btn blog-next" aria-label="Next" style={{ right: -16, top: '50%', transform: 'translateY(-50%)' }} onClick={() => scroll(1)}>
            <Icon name="arrow-right" size={20} color="#374151" />
          </button>
        </div>
      </div>
    </section>
  )
}
