'use client'
import { Icon } from '@/lib/icons'

interface Section { title: string; content: string | string[] }
interface LegalPageProps { badge: string; title: string; updated: string; sections: Section[] }

export default function LegalPage({ badge, title, updated, sections }: LegalPageProps) {
  return (
    <>
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <Icon name="chevron-right" size={12} />
        <span>{title}</span>
      </nav>
      <div className="legal-hero">
        <div className="sec-label"><span>{badge}</span></div>
        <h1 className="legal-title">{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
      </div>
      <div className="legal-body">
        <div className="legal-inner">
          {sections.map((sec, i) => (
            <div key={i} className="legal-section">
              <h2 className="legal-sec-title">{i + 1}. {sec.title}</h2>
              {Array.isArray(sec.content) ? (
                <ul className="legal-list">{sec.content.map((item, j) => <li key={j}>{item}</li>)}</ul>
              ) : (
                <p>{sec.content}</p>
              )}
            </div>
          ))}
        </div>
        <div className="legal-nav">
          <a href="/terms" className="legal-nav-link">Terms &amp; Conditions</a>
          <a href="/privacy" className="legal-nav-link">Privacy Policy</a>
          <a href="/disclaimer" className="legal-nav-link">Medical Disclaimer</a>
        </div>
      </div>
    </>
  )
}
