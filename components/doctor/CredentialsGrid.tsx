'use client'
import { useState } from 'react'
import type { DoctorInfo, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const credSections = (doctor: DoctorInfo, clinic: ClinicInfo) => [
  { num: '01', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Qualifications', sub: 'Degrees & Institutions', items: doctor.education.map(e => ({ title: e.degree, sub: e.institution })) },
  { num: '02', grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', title: 'Fellowships', sub: 'Specialised Training', items: doctor.fellowships.map(f => ({ title: f.title, sub: f.institution })) },
  { num: '03', grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', title: 'Work Experience', sub: 'Hospitals & Institutions', items: doctor.experience.map(e => ({ title: e.role, sub: e.hospital })) },
  { num: '04', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Certifications', sub: 'Professional Certifications', items: doctor.certifications.map(c => ({ title: c, sub: '' })) },
  { num: '05', grad: 'linear-gradient(135deg,var(--primary-dark),var(--secondary-deep))', title: 'Training & Workshops', sub: 'Continued Education', items: doctor.workshops.map(w => ({ title: w.title, sub: w.location })) },
  { num: '06', grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-dark))', title: 'Publications', sub: 'Research & Presentations', items: doctor.publications.map(p => ({ title: p.title, sub: p.journal })) },
  { num: '07', grad: 'linear-gradient(135deg,var(--secondary-dark),var(--secondary-deep))', title: 'Achievements', sub: 'Awards & Recognition', items: doctor.awards.map(a => ({ title: a.title, sub: a.year })) },
  { num: '08', grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', title: 'Professional Memberships', sub: 'Associations & Bodies', items: doctor.memberships.map(m => ({ title: m, sub: '' })) },
  { num: '09', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Medical Registration', sub: 'Verified Registration', items: [{ title: `Registration No. ${doctor.nmcNumber}`, sub: 'National Medical Commission · Verified & Active' }, { title: `${(doctor as any).registrationState || 'State'} Medical Council Registration`, sub: (doctor as any).registrationState ? `${(doctor as any).registrationState} Medical Council` : 'State Medical Council' }] },
  { num: '10', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Consultation Details', sub: 'Languages, Location & Hours', items: [{ title: 'Languages', sub: doctor.languages.join(' · ') }, { title: 'Location', sub: clinic.address }, { title: 'Hours', sub: clinic.hours }, { title: 'Second Opinion', sub: 'Available -- bring all previous reports.' }, { title: 'Online Consultation', sub: 'Available via WhatsApp or phone.' }] },
]

export default function CredentialsGrid({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  const [open, setOpen] = useState<number | null>(null)
  const sections = credSections(doctor, clinic)
  return (
    <section className="cred-section">
      <div className="sec-header">
        <div className="sec-label"><span>Credentials</span></div>
        <h2 className="sec-title">Professional background.</h2>
        <p className="sec-sub">A complete view of qualifications, experience, and clinical expertise.</p>
      </div>
      <div className="cred-grid">
        {sections.filter(s => s.items.length > 0).map((s, i) => (
          <div key={i} className="cred-item" onClick={() => setOpen(open === i ? null : i)} style={{ cursor: 'pointer' }}>
            <div className="cred-header">
              <div className="cred-num" style={{ background: s.grad }}>{s.num}</div>
              <div className="cred-header-text"><h3>{s.title}</h3><span>{s.sub}</span></div>
              <div className="cred-chevron" style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                <Icon name="chevron-down" size={20} />
              </div>
            </div>
            {open === i && (
              <div className="cred-body" style={{ padding: '0 1.5rem 1.5rem' }}>
                <ul className="cred-list">
                  {s.items.map((item, j) => (
                    <li key={j}>
                      <span className="cl-title">{item.title}</span>
                      {item.sub && <span className="cl-sub">{item.sub}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
