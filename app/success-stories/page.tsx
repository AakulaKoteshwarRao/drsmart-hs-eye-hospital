import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import StoriesHero from '@/components/success-stories/StoriesHero'
import VideoGrid from '@/components/success-stories/VideoGrid'
import StoriesFAQ from '@/components/success-stories/StoriesFAQ'
export const dynamic = 'force-dynamic'
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
  return (
    <>
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
