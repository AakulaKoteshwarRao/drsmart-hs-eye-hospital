'use client'
import { BlogPost } from '@/lib/blogs'
import { Icon } from '@/lib/icons'

const grads = [
  'linear-gradient(145deg, var(--secondary-deep), var(--secondary))',
  'linear-gradient(145deg, var(--primary), var(--primary-dark))',
]

function FeaturedCard({ post, grad, defaultTitle, defaultExcerpt }: { post: BlogPost | null; grad: string; defaultTitle?: string; defaultExcerpt?: string }) {
  const title   = post?.title   || defaultTitle || 'What to Expect at Your First Consultation'
  const excerpt = post?.excerpt  || defaultExcerpt || 'A practical guide covering what to bring and how to prepare for your first visit.'
  const href    = post?.slug ? `/blog/${post.slug}` : '/blog'
  const date    = post?.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Feb 2026'
  const cat     = post?.category || 'General'
  return (
    <div className="featured-card">
      <div className="featured-thumb" style={{ background: post?.featured_image ? 'transparent' : grad }}>
        {post?.featured_image
          ? <img src={post.featured_image} alt={title} width={600} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : <Icon name="file" size={40} color="rgba(255,255,255,0.4)" />}
      </div>
      <div className="featured-body">
        <span className="featured-tag">{cat}</span>
        <a href={href} className="featured-title-link"><h2 className="featured-title">{title}</h2></a>
        <p className="featured-excerpt">{excerpt}</p>
        <div className="featured-footer">
          <span className="featured-date">{date}</span>
          <a href={href} className="featured-read">Read Article <Icon name="arrow-right" size={16} /></a>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedPost({ post1, post2 }: { post1: BlogPost | null; post2?: BlogPost | null }) {
  return (
    <section className="featured-section">
      <div className="featured-grid">
        <FeaturedCard post={post1} grad={grads[0]} defaultTitle="What to Expect at Your First Consultation" defaultExcerpt="A practical guide covering what to bring, what to expect during your consultation, and how to prepare." />
        {post2 !== undefined && <FeaturedCard post={post2} grad={grads[1]} defaultTitle="Understanding Your Diagnosis: A Patient Guide" defaultExcerpt="How to understand your neurological diagnosis, ask the right questions, and make informed decisions about your treatment." />}
      </div>
    </section>
  )
}
