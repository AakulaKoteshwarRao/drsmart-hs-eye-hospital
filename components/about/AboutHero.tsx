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
        <div className="about-hero-image">
          {clinic.aboutImage ? (
            <img src={clinic.aboutImage} alt={`About ${clinic.name}`} width={800} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} loading="lazy" />
          ) : (
            <Icon name="stethoscope" size={64} color="var(--primary)" />
          )}
        </div>
      </div>
    </section>
  )
}
