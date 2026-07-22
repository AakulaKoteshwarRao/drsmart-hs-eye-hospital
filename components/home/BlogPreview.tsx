'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import type { BlogPost } from '@/lib/types'
import { Icon } from '@/lib/icons'

// Thumbnail with its own error state so a broken/missing featured image
// falls back to the gradient + file icon instead of showing nothing.
function BlogThumb({ image, gradStyle, title }: { image?: string; gradStyle: string; title: string }) {
  const [err, setErr] = useState(false)
  const bg = gradStyle.replace('background: ', '')
  return (
    <div className="blog-slide-thumb" style={{ background: bg, position: 'relative' }}>
      {image && !err ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          onError={() => setErr(true)}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <Icon name="file" size={40} color="rgba(255,255,255,0.4)" />
      )}
    </div>
  )
}

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => { ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' }) }

  if (!posts?.length) return null
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
                <BlogThumb image={post.image} gradStyle={post.gradStyle} title={post.title} />
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
