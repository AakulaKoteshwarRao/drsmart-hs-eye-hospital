'use client'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function GuidanceSection({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="guidance-section">
      <div className="guidance-inner">
        <h2>Not sure which package is right for you?</h2>
        <p>Talk to us. We will review your history, assess your condition, and recommend the most appropriate package for your situation. There is no obligation -- just honest guidance.</p>
        <div className="guidance-actions">
          <a href="/appointment" className="guidance-primary" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
            Book a Consultation <Icon name="arrow-right" size={16} />
          </a>
          <a href={`https://wa.me/${clinic.whatsapp.replace('+', '')}`} className="guidance-secondary">WhatsApp Us</a>
        </div>
      </div>
    </section>
  )
}
