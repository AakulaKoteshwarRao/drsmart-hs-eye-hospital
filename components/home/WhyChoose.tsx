import { Icon } from '@/lib/icons'

// HS Eye — "Why Choose Us" grouped into 4 themed cards, 3 points each.
const WHY_GROUPS = [
  {
    iconColor: 'teal',
    iconType: 'award',
    title: 'Accredited Eye Hospital',
    points: [
      'First NABH Accredited Eye Hospital in Nizamabad',
      'Independent, Non-Corporate, Patient-Centric Hospital',
      '30,000 Sq. Ft. Dedicated Eye Care Facility',
    ],
  },
  {
    iconColor: 'blue',
    iconType: 'eye',
    title: 'Injection-Free Cataract Surgery',
    points: [
      'Pioneer in Topical (Injection-Free) Cataract Surgery in Nizamabad',
      'Injection-Free Cataract Surgery using Topical Anesthesia',
      'Resident Topical Cataract Surgeon in Nizamabad',
    ],
  },
  {
    iconColor: 'deep',
    iconType: 'zap',
    title: 'Advanced Technology',
    points: [
      'Among the First Contoura Vision Centers in North Telangana',
      'Blade-Free, Topography-Guided LASIK for Precise Results',
      'Modern Diagnostic Suite for Accurate Eye Assessment',
    ],
  },
  {
    iconColor: 'green',
    iconType: 'star',
    title: 'Committed to the Best',
    points: [
      'Focus on Personalized Care and Clinical Excellence',
      'High Patient Satisfaction and Quality Outcomes',
      'Trusted by Doctors & VIPs for Their Own Eye Care',
    ],
  },
] as const

export default function WhyChoose({ title }: { title?: string }) {
  return (
    <section className="why-section">
      <div className="sec-header">
        <div className="sec-label"><span>Why Choose Us</span></div>
        <h2 className="sec-title">{title || 'The difference.'}</h2>
        <p className="sec-sub">What sets us apart in delivering care that patients trust.</p>
      </div>
      <div className="why-grid">
        {WHY_GROUPS.map((card, i) => (
          <div key={i} className="why-card">
            <div className={`why-icon ${card.iconColor}`}>
              <Icon name={card.iconType} size={28} color="#FFFFFF" />
            </div>
            <h3>{card.title}</h3>
            <ul className="why-points">
              {card.points.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
