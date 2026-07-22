import Image from 'next/image'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function AboutHero({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="about-hero">
      <div className="about-hero-grid">
        <div>
          <div className="sec-label"><span>About Us</span></div>
          <h1>Healthcare built on <em>trust and transparency.</em></h1>
          <div className="about-hero-text">
            <p>Our clinic is dedicated to providing evidence-based specialist care with a focus on honest communication, personalised treatment, and lasting outcomes. Every patient receives the same level of attention -- from the first consultation to full recovery.</p>
            <p>With modern infrastructure, experienced clinical staff, and a commitment to transparency, the practice has built a reputation for reliable, patient-first care across {clinic.city}.</p>
          </div>
        </div>
        <div className="about-hero-image" style={{ position: 'relative' }}>
          {clinic.aboutImage ? (
            <Image src={clinic.aboutImage} alt={`About ${clinic.name}`} fill sizes="(max-width: 768px) 100vw, 800px" style={{ objectFit: 'cover', borderRadius: '16px' }} />
          ) : (
            <Icon name="stethoscope" size={64} color="var(--primary)" />
          )}
        </div>
      </div>
    </section>
  )
}
