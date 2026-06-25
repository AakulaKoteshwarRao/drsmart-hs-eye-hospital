import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import Footer from '@/components/Footer'
import BlogHero from '@/components/blog/BlogHero'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogGrid from '@/components/blog/BlogGrid'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import { getBlogs } from '@/lib/blogs'
import '@/app/styles/blog.css'

export default async function BlogPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const blogs = await getBlogs()

  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'home',
    meta: {
      path:        '/blog',
      name:        `Blog | ${sc.clinic.name}`,
      description: sc.clinic.description,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Blog', url: sc.site.url + '/blog', path: '/blog' },
      ],
    },
  })

  const featured1 = blogs[0] || null
  const featured2 = blogs[1] || null
  const rest     = blogs.slice(2)

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <BlogHero />
        <FeaturedPost post1={featured1} post2={featured2} />
        <BlogGrid posts={rest} conditions={cfg.conditions} />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
