import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import StoriesHero from '@/components/success-stories/StoriesHero'
import VideoGrid from '@/components/success-stories/VideoGrid'
import StoriesFAQ from '@/components/success-stories/StoriesFAQ'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
export const revalidate = 3600
import { loadConfig, fetchVideos } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/success-stories.css'

export default async function SuccessStoriesPage() {
  const cfg = await loadConfig()
  const rawVideos = await fetchVideos()
  const dynamicStories = rawVideos.map((v: Record<string, unknown>) => ({
    id: v.id as string,
    youtubeUrl: v.youtube_url as string,
    title: v.title as string || '',
    caption: v.caption as string || '',
    category: v.category as string || 'patient_story',
    tags: [],
    duration: '',
    thumbnail: '',
  }))
  const stories = dynamicStories.length > 0 ? dynamicStories : cfg.successStories.stories
  const { videoCount, conditionCount, rating } = cfg.successStories

  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'collection',
    meta: {
      path:        '/success-stories',
      name:        `Success Stories | ${sc.clinic.name}`,
      description: `Patient success stories from ${sc.clinic.name}.`,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Success Stories', url: sc.site.url + '/success-stories', path: '/success-stories' },
      ],
    },
  })
  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <StoriesHero videoCount={videoCount} conditionCount={conditionCount} rating={rating} />
        <VideoGrid stories={stories} conditions={cfg.conditions} />
        <StoriesFAQ />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
