import { loadConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import '@/app/styles/contact.css'

export const dynamic = 'force-dynamic'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await loadConfig()
  const clinic = cfg.clinic as any
  return buildPageMetadata(cfg, {
    title: 'Contact Us',
    description: `Get in touch with ${clinic?.name || 'our clinic'} in ${clinic?.city || ''}. Call, WhatsApp or visit us at ${clinic?.address || 'our clinic'}.`,
    path: '/contact',
  })
}

export default async function ContactPage() {
  const cfg = await loadConfig()
  const { clinic } = cfg
  const areas = cfg.areas ?? []

  const hoursObj = (clinic as any).hoursObj ?? {}
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

  const hoursRows = DAYS
    .filter(day => hoursObj[day])
    .map(day => ({
      day,
      open: hoursObj[day]?.open ?? '',
      close: hoursObj[day]?.close ?? '',
      isToday: day === today,
    }))

  const mapSrcMatch = null
  const mapSrc = (clinic as any).mapEmbedUrl || ''

  const whatsappNum = (clinic as any).whatsapp ?? clinic.phone
  const waLink = `https://wa.me/${whatsappNum?.replace(/\D/g,'')}`
  const social = (clinic as any).social ?? {}

  return (
    <>
      <Header clinic={clinic} />
      <StickyBar clinic={clinic} />

      <section className="contact-hero">
        <div className="sec-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
          <span>Get In Touch</span>
        </div>
        <h1>Visit {clinic.name}</h1>
        <p>We&apos;re here to help. Reach out to us anytime.</p>
        <div className="contact-hero-btns">
          <a href={`tel:${clinic.phone}`} className="contact-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            Call Us
          </a>
          <a href={waLink} className="contact-btn-secondary" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            WhatsApp
          </a>
          <a href="/appointment" className="contact-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Appointment
          </a>
        </div>
      </section>

      <div className="sec-grey">
        <div className="sec-pad">
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg,#3CB8AF,#2A9D8F)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              </div>
              <h3>Phone</h3>
              <p><a href={`tel:${clinic.phone}`}>{clinic.phone}</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </div>
              <h3>WhatsApp</h3>
              <p><a href={waLink} target="_blank" rel="noopener noreferrer">{whatsappNum}</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg,#1B6FA8,#145A8A)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3>Email</h3>
              <p><a href={`mailto:${(clinic as any).email}`}>{(clinic as any).email}</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg,#0D3B5E,#1B6FA8)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3>Address</h3>
              <p>{clinic.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sec-white">
        <div className="sec-pad">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <div className="sec-header">
                <div className="sec-label"><span>Location</span></div>
                <h2 className="sec-title">Find us here.</h2>
              </div>
              {mapSrc ? (
                <div className="contact-map-wrap">
                  <iframe src={mapSrc} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              ) : (
                <div className="contact-map-wrap" style={{ background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#9CA3AF' }}>Map not available</p>
                </div>
              )}
              <a href={(clinic as any).googleDirectionsUrl ?? (clinic as any).hasMap ?? '#'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.88rem', fontWeight: '700', color: '#1B6FA8', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                Get Directions
              </a>
            </div>
            <div>
              <div className="sec-header">
                <div className="sec-label"><span>Hours</span></div>
                <h2 className="sec-title">Opening hours.</h2>
              </div>
              {hoursRows.length > 0 ? (
                <table className="hours-table">
                  <tbody>
                    {hoursRows.map((row) => (
                      <tr key={row.day} className={row.isToday ? 'hours-today' : ''}>
                        <td>{row.day}{row.isToday && ' (Today)'}</td>
                        <td>{row.open} – {row.close}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#374151', fontSize: '0.92rem' }}>{clinic.hours}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {areas.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Service Area</span></div>
              <h2 className="sec-title">Areas we serve.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Conveniently located in {clinic.area}, {clinic.city} — serving patients from nearby areas.</p>
            </div>
            <div className="areas-grid">
              {areas.map((area: any, i: number) => (
                <a key={i} href={`/specialist-near-${area.slug}`} className="area-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {area.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {(social.google || social.facebook || social.instagram || social.youtube) && (
        <div className="sec-white">
          <div className="sec-pad" style={{ textAlign: 'center' }}>
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Connect</span></div>
              <h2 className="sec-title">Find us online.</h2>
            </div>
            <div className="contact-social-links">
              {social.google && (
                <a href={social.google} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 11h8.533c.044.385.067.78.067 1.184 0 5.26-3.52 9-8.6 9C6.48 21.184 2 16.704 2 11S6.48.816 12 .816c2.44 0 4.48.895 6.04 2.355l-2.52 2.52C14.573 4.79 13.373 4.28 12 4.28c-3.19 0-5.76 2.71-5.76 6.72s2.57 6.72 5.76 6.72c2.69 0 4.54-1.52 5.12-3.72H12V11z"/></svg>
                  Google
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  Facebook
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                  Instagram
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <CTABand cta={cfg.ctaBand} />
      <Footer clinic={clinic} config={cfg} />
    </>
  )
}
