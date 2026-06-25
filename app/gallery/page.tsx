import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import Footer from '@/components/Footer'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryGrid from '@/components/gallery/GalleryGrid'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import '@/app/styles/gallery.css'

export default async function GalleryPage() {
  const cfg = await loadConfig()
  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <GalleryHero />
        <GalleryGrid photos={cfg.photos} />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
