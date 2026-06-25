'use client'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function StickyBar({ clinic }: { clinic: ClinicInfo }) {
  return (
    <div className="sticky-bar">
      <div className="sticky-bar-inner">
        <a href={`tel:${clinic.phone}`} className="call">
          <Icon name="phone" size={18} />
          <span>Call</span>
        </a>
        <div className="bar-divider"></div>
        <a href={`https://wa.me/${clinic.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="whatsapp">
          <Icon name="whatsapp" size={18} />
          <span>WhatsApp</span>
        </a>
        <div className="bar-divider"></div>
        <a href="/appointment" className="appointment" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
          <Icon name="calendar" size={18} />
          <span>Appointment</span>
        </a>
      </div>
    </div>
  )
}
