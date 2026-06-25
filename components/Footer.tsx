import type { ClinicInfo, ClinicConfig } from '@/lib/types'
import { Icon } from '@/lib/icons'

const QUICK_LINKS_BY_ENTITY: Record<string, { label: string; href: string }[]> = {
  'Physician': [
    { label: 'Doctor', href: '/doctor' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Locations', href: '/locations' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Book Appointment', href: '/appointment' },
  ],
  'Solo Clinic': [
    { label: 'About', href: '/about' },
    { label: 'Doctor', href: '/doctor' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Locations', href: '/locations' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Book Appointment', href: '/appointment' },
  ],
  'Multi-Doctor Clinic': [
    { label: 'About', href: '/about' },
    { label: 'Doctor', href: '/doctor' },
    { label: 'Team', href: '/team' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Locations', href: '/locations' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Book Appointment', href: '/appointment' },
  ],
  'Group Practice': [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Locations', href: '/locations' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Book Appointment', href: '/appointment' },
  ],
}

const DEFAULT_QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Doctor', href: '/doctor' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Book Appointment', href: '/appointment' },
]

export default function Footer({ clinic, config }: { clinic: ClinicInfo; config?: Partial<ClinicConfig> }) {
  const year = new Date().getFullYear()
  const social = clinic.social || {}
  const entityType = clinic.type || ''
  const quickLinks = QUICK_LINKS_BY_ENTITY[entityType] || DEFAULT_QUICK_LINKS
  const serviceLinks = [
    ...((config?.services?.conditions || []).slice(0, 4).map((s: any) => ({ label: s.title, href: `/conditions/${s.slug}` }))),
    ...((config?.procedures || []).slice(0, 2).map((p: any) => ({ label: p.title, href: `/procedures/${p.slug}` }))),
    { label: 'View All Services', href: '/services' },
  ]

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>Quick Links</h3>
          <div className="footer-links">
            {quickLinks.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}
          </div>
        </div>
        <div>
          <h3>Services</h3>
          <div className="footer-links">
            {serviceLinks.map((l, i) => <a key={i} href={(l as any).href}>{(l as any).label}</a>)}
          </div>
        </div>
        <div>
          <h3>Contact</h3>
          <div className="footer-contact">
            <div className="contact-item"><Icon name="location" size={15} /><span>{clinic.address}</span></div>
            <div className="contact-item"><Icon name="phone" size={15} /><a href={`tel:${clinic.phone}`}>{clinic.phone}</a></div>
            <div className="contact-item"><Icon name="envelope" size={15} /><a href={`mailto:${clinic.email}`}>{clinic.email}</a></div>
            <div className="contact-item"><Icon name="clock" size={15} /><span>{clinic.hours}</span></div>
            <div className="contact-divider"></div>
            <div className="social-links">
              {social.google && (
                <a href={social.google} target="_blank" rel="noreferrer" aria-label="Google Business Profile">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="footer-map">
          <h3>Directions</h3>
          <a href={clinic.mapsUrl || clinic.mapUrl} target="_blank" rel="noopener" title="Get Directions">
            <div className="map-visual">
              <div className="map-pin">
                <Icon name="location" size={32} />
                <div className="map-pin-shadow"></div>
              </div>
              <div className="map-label">
                <Icon name="external-link" size={11} /> Get Directions
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className="footer-disclaimer">
        <p>The information provided on this website is for general informational purposes only. It is not intended as medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.</p>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; {year} {clinic.name}. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/terms">Terms & Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/disclaimer">Medical Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
