import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function ClinicStrip({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="clinic-strip">
      <div className="clinic-strip-inner">
        <div className="cs-item">
          <div className="cs-icon"><Icon name="location" size={20} color="#FFFFFF" /></div>
          <div className="cs-text"><h4>Clinic Address</h4><p>{clinic.address}</p></div>
        </div>
        <div className="cs-item">
          <div className="cs-icon"><Icon name="clock" size={20} color="#FFFFFF" /></div>
          <div className="cs-text"><h4>Working Hours</h4><p>{clinic.hours}</p></div>
        </div>
        <div className="cs-item">
          <div className="cs-icon"><Icon name="phone" size={20} color="#FFFFFF" /></div>
          <div className="cs-text"><h4>Phone</h4><p>{clinic.phone}</p></div>
        </div>
      </div>
    </section>
  )
}
