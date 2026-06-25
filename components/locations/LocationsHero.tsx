import type { ClinicInfo } from '@/lib/types'

export default function LocationsHero({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="loc-hero">
      <div className="sec-label"><span>Location</span></div>
      <h1>Specialist Clinic in <em>{clinic.area}, {clinic.city}.</em></h1>
      <p className="loc-hero-text">Expert specialist care in the heart of {clinic.city}. Located at {clinic.hospital}, {clinic.area} -- easily accessible from {clinic.area} and surrounding areas.</p>
    </section>
  )
}
