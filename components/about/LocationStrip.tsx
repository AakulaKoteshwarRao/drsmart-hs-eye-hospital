import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function LocationStrip({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="location-section">
      <div className="sec-header">
        <div className="sec-label"><span>Location</span></div>
        <h2 className="sec-title">How to reach us.</h2>
        <p className="sec-sub">Conveniently located in the heart of {clinic.city}.</p>
      </div>
      <div className="location-grid">
        <div className="location-map">
          <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-base)' }}>Google Map Embed</span>
        </div>
        <div className="location-details">
          <div className="loc-item">
            <div className="loc-icon"><Icon name="location" size={20} color="#FFFFFF" /></div>
            <div>
              <h4>Address</h4>
              <p>{clinic.address}</p>
              <a href={clinic.mapUrl} target="_blank" rel="noreferrer">Get Directions &rarr;</a>
            </div>
          </div>
          <div className="loc-item">
            <div className="loc-icon"><Icon name="clock" size={20} color="#FFFFFF" /></div>
            <div><h4>Working Hours</h4><p>{clinic.hours}</p></div>
          </div>
          <div className="loc-item">
            <div className="loc-icon"><Icon name="phone" size={20} color="#FFFFFF" /></div>
            <div>
              <h4>Contact</h4>
              <p>Phone: <a href={`tel:${clinic.phone}`}>{clinic.phone}</a><br/>
              WhatsApp: <a href={`https://wa.me/${clinic.whatsapp.replace('+','')}`}>{clinic.whatsapp}</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
