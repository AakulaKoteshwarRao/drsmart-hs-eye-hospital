import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import StoriesHero from '@/components/success-stories/StoriesHero'
import VideoGrid from '@/components/success-stories/VideoGrid'
import StoriesFAQ from '@/components/success-stories/StoriesFAQ'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/success-stories.css'

export default async function SuccessStoriesPage() {
  const cfg = await loadConfig()
  const { videoCount, conditionCount, rating, stories } = cfg.successStories
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
