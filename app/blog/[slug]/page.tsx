import Image from 'next/image'
import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import StickyBar from '@/components/StickyBar'
import Footer from '@/components/Footer'
import CTABand from '@/components/home/CTABand'
export const revalidate = 3600
import { loadConfig } from '@/lib/config'
import BlogAuthor from '@/components/blog/BlogAuthor'
import type { Metadata } from 'next'
import { buildBlogMetadata } from '@/lib/seo'
import { getBlogBySlug } from '@/lib/blogs'
import '@/app/styles/blog-post.css'

export async function generateMetadata({ params }: { params?: { slug?: string } }): Promise<Metadata> {
  const cfg  = await loadConfig()
  const slug = params?.slug || ''
  const post = await getBlogBySlug(slug)
  return buildBlogMetadata(cfg, {
    title:       post?.meta_title || post?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    slug,
    excerpt:     post?.meta_description || post?.excerpt,
    coverImage:  post?.featured_image,
    publishedAt: post?.published_at,
  })
}

export default async function BlogPostPage({ params }: { params?: { slug?: string } }) {
  const cfg  = await loadConfig()
  const sc   = buildSchemaConfig(cfg)
  const slug = params?.slug || ''
  const post = await getBlogBySlug(slug)

  const _path = `/blog/${slug}`
  const title = post?.meta_title || post?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const description = post?.meta_description || post?.excerpt || sc.clinic.description
  const date  = post?.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'blog',
    pageData: {
      slug,
      title:         post?.title || title,
      headline:      post?.title || title,
      description:   post?.excerpt || description,
      excerpt:       post?.excerpt || '',
      body:          post?.content || '',
      keywords:      post?.keywords || '',
      image:         post?.featured_image || sc.clinic.image,
      imageWidth:    1200,
      imageHeight:   630,
      datePublished: post?.published_at || '',
      dateModified:  post?.published_at || '',
      wordCount:     post?.content ? post.content.replace(/<[^>]+>/g, '').split(/\s+/).length : 0,
      schemaType:    'BlogPosting',
      category:      post?.category || 'Healthcare',
      faq:           (Array.isArray(post?.faq) ? post.faq : [])
                       .map((f) => ({ q: f.question ?? f.q ?? '', a: f.answer ?? f.a ?? '' }))
                       .filter((f) => f.q && f.a),
    },
    meta: {
      path:        _path,
      name:        `${title} | ${sc.clinic.name}`,
      description,
      image:       post?.featured_image || sc.clinic.image,
      breadcrumb:  [
        { name: 'Home',  url: sc.site.url,              path: '/' },
        { name: 'Blog',  url: sc.site.url + '/blog',    path: '/blog' },
        { name: title,   url: sc.site.url + _path,      path: _path },
      ],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <article className="article-wrap">

          {/* Breadcrumb */}
          <nav className="post-breadcrumb">
            <a href="/">Home</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            <a href="/blog">Blog</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            <span>{post?.category || 'Article'}</span>
          </nav>

          <span className={`post-tag tag-${(post?.category || 'general').toLowerCase().replace(/\s+/g, '-')}`}>
            {post?.category || 'Article'}
          </span>
          <h1 className="post-title">{post?.title || title}</h1>

          <div className="post-meta">
            <div className="post-meta-avatar" style={{ position: 'relative' }}>
              {cfg.doctor?.photo
                ? <Image src={cfg.doctor.photo} alt={cfg.doctor.name} fill sizes="48px" style={{ objectFit: 'cover', borderRadius: '50%' }} />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
            </div>
            <div className="post-meta-info">
              <span className="post-meta-author">{cfg.doctor?.name || sc.clinic.name}</span>
              <span className="post-meta-date">{date}</span>
            </div>
          </div>

          {/* Featured image */}
          <div className="post-featured" style={{ background: 'linear-gradient(145deg,var(--primary-dark),var(--secondary))', position: 'relative' }}>
            {post?.featured_image
              ? <Image src={post.featured_image} alt={title} fill sizes="(max-width: 768px) 100vw, 800px" style={{ objectFit: 'cover' }} priority />
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            }
          </div>

          {/* Post content — rendered from Supabase HTML */}
          {post?.content
            ? <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            : (
              <div className="post-content">
                <p>This article is not available yet. Check back soon.</p>
              </div>
            )
          }

          {/* Author section — BlogAuthor component with Author schema */}
          <BlogAuthor
            name={cfg.doctor?.name || sc.clinic.name}
            photo={cfg.doctor?.photo}
            degrees={cfg.doctor?.degrees}
            yearsExp={(cfg.doctor?.stats?.[0] as any)?.number || '15'}
            specialties={cfg.doctor?.specialties || []}
            profileUrl="/doctor"
            clinicName={sc.clinic.name}
            clinicUrl={sc.site?.url || (cfg.clinic as any)?.website || ''}
            publishedAt={post?.published_at || ''}
          />

        </article>

        {/* CTA Band */}
        <CTABand cta={cfg.ctaBand} />

        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
