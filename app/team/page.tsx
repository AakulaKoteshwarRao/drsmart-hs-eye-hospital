import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import TeamHero from '@/components/team/TeamHero'
import TeamCarousel from '@/components/team/TeamCarousel'
import TeamFAQ from '@/components/team/TeamFAQ'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { teamSchema } from '@/lib/schema/coreSchemas.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
export const revalidate = 3600
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/team.css'

export default async function TeamPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'page',
    meta: {
      path:        '/team',
      name:        `Our Team | ${sc.clinic.name}`,
      description: `Meet the team at ${sc.clinic.name}.`,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Our Team', url: sc.site.url + '/team', path: '/team' },
      ],
    },
  })
  const teamNodes = teamSchema(sc, cfg.team)
  return (
    <>
      <SchemaMarkup graphs={[[...pageSchemas, ...teamNodes]]} />
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
