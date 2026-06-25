/**
 * BlogAuthor.tsx
 *
 * Displays doctor author bio on blog posts.
 * Includes JSON-LD Author schema for AI citability signals.
 * Auto-populated from config — zero manual work per client.
 */

interface BlogAuthorProps {
  name: string
  photo?: string
  degrees?: string
  yearsExp?: string
  specialties?: string[]
  profileUrl?: string
  clinicName?: string
  clinicUrl?: string
  publishedAt?: string
}

export default function BlogAuthor({
  name,
  photo,
  degrees,
  yearsExp = '10+',
  specialties = [],
  profileUrl = '/doctor',
  clinicName = '',
  clinicUrl = '',
  publishedAt,
}: BlogAuthorProps) {
  // Build Author schema for AI citability
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    honorificPrefix: 'Dr.',
    ...(degrees ? { description: degrees } : {}),
    ...(photo ? { image: photo } : {}),
    ...(profileUrl && clinicUrl ? { url: `${clinicUrl}${profileUrl}` } : {}),
    ...(clinicName ? {
      worksFor: {
        '@type': 'MedicalOrganization',
        name: clinicName,
        ...(clinicUrl ? { url: clinicUrl } : {}),
      }
    } : {}),
    ...(specialties.length > 0 ? { knowsAbout: specialties } : {}),
  }

  return (
    <>
      {/* Author schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      {/* Author bio UI */}
      <div className="author-section">
        <div className="author-avatar">
          {photo ? (
            <img
              src={photo}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
        </div>
        <div className="author-info">
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Written by
          </div>
          <h3>{name}</h3>
          {degrees && <div className="author-role">{degrees}</div>}
          <p>
        {String(yearsExp).replace(/\+/g, '')}+ years of experience
            {specialties.length > 0 ? ` specialising in ${specialties.slice(0, 2).join(', ')}` : ''}.
            {clinicName ? ` Practising at ${clinicName}.` : ''}
          </p>
          <a href={profileUrl} className="author-link">
            View Full Profile{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
