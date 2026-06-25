'use client'
import { useState } from 'react'
import { BlogPost } from '@/lib/blogs'
import { Icon } from '@/lib/icons'

const grads = [
  'linear-gradient(145deg,var(--secondary-deep),var(--secondary))',
  'linear-gradient(145deg,var(--primary),var(--primary-dark))',
  'linear-gradient(145deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(145deg,var(--primary-dark),var(--secondary-deep))',
  'linear-gradient(145deg,var(--secondary-dark),var(--primary))',
  'linear-gradient(145deg,var(--primary),var(--secondary))',
]

export default function BlogGrid({ posts, conditions = [] }: { posts: BlogPost[]; conditions?: any[] }) {
  const items = posts.length > 0
    ? posts.map((p, i) => ({ grad: grads[i % grads.length], href: `/blog/${p.slug}`, title: p.title, excerpt: p.excerpt, date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '', tag: p.category || 'General', tagClass: `tag-${(p.category || 'general').toLowerCase().replace(/\s+/g, '-')}`, image: p.featured_image || null }))
    : conditions.slice(0, 6).map((c: any, i: number) => ({ grad: grads[i % grads.length], href: `/blog/${c.slug || c.label?.toLowerCase().replace(/\s+/g, '-')}`, title: `Understanding ${c.title || c.label}: What Patients Should Know`, excerpt: c.description || `Learn about ${c.title || c.label}, its symptoms, causes, and treatment options.`, date: '01 Jan 2026', tag: 'Conditions', tagClass: 'tag-conditions', image: null }))

  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? items : items.filter(item => item.tag.toLowerCase() === active)
  if (items.length === 0) return null

  return (
    <section className="blog-section">
      <div className="blog-inner">
        <div className="sec-header">
          <div className="sec-label"><span>All Articles</span></div>
          <h2 className="sec-title">From our blog.</h2>
        </div>
        <div className="blog-filter-wrap">
          <span className="blog-filter-label">Filter by:</span>
          <select className="blog-filter-select" value={active} onChange={e => setActive(e.target.value)}>
            <option value="all">All Articles</option>
            <option value="conditions">Conditions</option>
            <option value="procedures">Procedures</option>
            <option value="general">General</option>
          </select>
        </div>
        <div className="blog-grid">
          {filtered.map((post, i) => (
            <a key={i} href={post.href} className="blog-slide">
              <div className="blog-slide-thumb" style={{ background: post.image ? 'transparent' : post.grad }}>
                {post.image ? <img src={post.image} alt={post.title} width={400} height={250} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /> : <Icon name="file" size={40} color="rgba(255,255,255,0.4)" />}
              </div>
              <div className="blog-slide-body">
                <span className={`blog-tag ${post.tagClass}`}>{post.tag}</span>
                <h3 className="blog-slide-title">{post.title}</h3>
                <p className="blog-slide-excerpt">{post.excerpt}</p>
                <div className="blog-slide-footer">
                  <span className="blog-slide-date">{post.date}</span>
                  <span className="blog-slide-read">Read <Icon name="arrow-right" size={12} /></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
