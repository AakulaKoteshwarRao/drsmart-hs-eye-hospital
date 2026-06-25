import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import TeamHero from '@/components/team/TeamHero'
import TeamCarousel from '@/components/team/TeamCarousel'
import TeamFAQ from '@/components/team/TeamFAQ'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/team.css'

export default async function TeamPage() {
  const cfg = await loadConfig()
  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <TeamHero />
        <TeamCarousel members={cfg.team} showLead={true} />
        <TeamFAQ clinic={cfg.clinic} />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
