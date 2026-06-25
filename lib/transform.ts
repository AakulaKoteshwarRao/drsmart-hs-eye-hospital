/**
 * lib/transform.ts
 * Transforms raw portal config (s00-s23 JSONB from Supabase) into the full
 * ClinicConfig shape that the website template expects.
 *
 * Section mapping (matches ConfigEditor.tsx exactly):
 *  s00 — Entity Profile (entityType, primaryColor, secondaryColor, kwPrimary, kwSecondary)
 *  s01 — Site (url, blogPath)
 *  s02 — Entity/Clinic (name, telephone, email, city, street, hours, languages, hasMap, mapEmbedUrl, ratingValue, reviewCount, socialGoogle, socialFacebook, socialInstagram, socialPracto, medicalSpecialty)
 *  s03 — Doctor (name, jobTitle, gender, regNumber, degrees[], specialties[], stats[], awards[], experience[], memberships[], certifications[])
 *  s04 — Hero (auto-generated, no user fields)
 *  s05 — Trust Strip (items[])
 *  s06 — Why Choose (items[])
 *  s07 — Conditions (conditions[])
 *  s08 — Procedures (procedures[])
 *  s09 — Services (services[])
 *  s10 — Packages (packages[])
 *  s11 — How We Work (steps[])
 *  s12 — Clinical Info (cards[])
 *  s13 — Reviews (reviews[])
 *  s14 — FAQ (faqs[])
 *  s15 — Pricing (sections[])
 *  s16 — Patient Stories
 *  s17 — Locations/Areas (areas[])
 *  s18 — Blog (posts[])
 *  s19 — HowTo Guides (guides[])
 *  s20 — CTA Band
 *  s21 — Team (members[])
 *  s23 — Digital Presence (customLinks[])
 */

import type { ClinicConfig, ClinicInfo, DoctorInfo, HeroSection } from './types'

// ─── Gradient cycles ──────────────────────────────────────────────────────────
const GRAD_CLASSES  = ['grad-teal', 'grad-blue', 'grad-deep', 'grad-warm']
const GRAD_STRINGS  = [
  'linear-gradient(145deg,var(--secondary-deep),var(--secondary))',
  'linear-gradient(145deg,var(--secondary),var(--primary))',
  'linear-gradient(145deg,var(--primary),var(--primary-dark))',
  'linear-gradient(145deg,var(--secondary-dark),var(--primary-dark))',
  'linear-gradient(145deg,var(--primary-dark),var(--secondary-deep))',
  'linear-gradient(145deg,var(--secondary-deep),var(--primary))',
]
const TEAM_GRADS    = [
  'linear-gradient(160deg,var(--secondary-deep) 0%,var(--secondary) 40%,var(--primary) 100%)',
  'linear-gradient(160deg,var(--secondary) 0%,var(--secondary-dark) 40%,var(--primary) 100%)',
  'linear-gradient(160deg,var(--primary) 0%,var(--primary-dark) 40%,var(--secondary) 100%)',
]
const g  = (i: number) => GRAD_CLASSES[i  % GRAD_CLASSES.length]
const gs = (i: number) => GRAD_STRINGS[i  % GRAD_STRINGS.length]
const gt = (i: number) => TEAM_GRADS[i    % TEAM_GRADS.length]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toWhatsapp(phone: string): string {
  return (phone || '').replace(/\D/g, '')
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function initials(name: string): string {
  const parts = (name || '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.[0] || 'X').toUpperCase()
}

const s = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback)
const a = (v: unknown): any[] => (Array.isArray(v) ? v : [])

// ─── Main transform ───────────────────────────────────────────────────────────

export function transformConfig(raw: Record<string, any>): ClinicConfig {
  // ── Section destructure (matches ConfigEditor.tsx section IDs) ────────────
  const s00 = raw?.s00 ?? {}   // Entity Profile
  const s01 = raw?.s01 ?? {}   // Site
  const s02 = raw?.s02 ?? {}   // Entity/Clinic info
  const s03 = raw?.s03 ?? {}   // Doctor
  const s04 = raw?.s04 ?? {}   // Hero (overrides)
  const s05 = raw?.s05 ?? {}   // Trust Strip
  const s06 = raw?.s06 ?? {}   // Why Choose
  const s07 = raw?.s07 ?? {}   // Conditions
  const s08 = raw?.s08 ?? {}   // Procedures
  const s09 = raw?.s09 ?? {}   // Services
  const s10 = raw?.s10 ?? {}   // Packages
  const s11 = raw?.s11 ?? {}   // How We Work
  const s12 = raw?.s12 ?? {}   // Clinical Info
  const s13 = raw?.s13 ?? {}   // Reviews
  const s14 = raw?.s14 ?? {}   // FAQ
  const s15 = raw?.s15 ?? {}   // Pricing
  const s16 = raw?.s16 ?? {}   // Patient Stories
  const s17 = raw?.s17 ?? {}   // Areas
  const s18 = raw?.s18 ?? {}   // Blog
  const s21 = raw?.s21 ?? {}   // Team
  const s23 = raw?.s23 ?? {}   // Digital Presence

  // ── Clinic ────────────────────────────────────────────────────────────────
  // s02 = Entity section in ConfigEditor
  const phone    = s(s02.telephone, '+91-0000000000')
  const whatsapp = s(s02.whatsapp, toWhatsapp(phone))
  const mapsUrl  = s(s02.hasMap, '')
  const website  = s(s01.url, '')

  // Extract lat/lng from maps URL
  let geoLat = '', geoLng = ''
  const geoMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (geoMatch) { geoLat = geoMatch[1]; geoLng = geoMatch[2] }

  // Build hoursSchema array for schema markup
  const hoursObj = (s02.hours && typeof s02.hours === 'object') ? s02.hours as Record<string, { open: string; close: string }> : {}
  const DAYS_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const hoursSchema = DAYS_ORDER
    .filter(d => hoursObj[d]?.open && hoursObj[d]?.close)
    .map(d => ({ days: [d], opens: hoursObj[d].open, closes: hoursObj[d].close }))

  const clinic: ClinicInfo = {
    name:        s(s02.brandName ?? s02.name, 'Clinic'),
    tagline:     s(s02.alternateName, ''),
    type:        s(s00.entityType, ''),
    phone,
    whatsapp,
    email:       s(s02.email, ''),
    address:     [s(s02.buildingName,''), s(s02.street,''), s(s02.city,'')].filter(Boolean).join(', '),
    city:        s(s02.city, ''),
    area:        s(s02.area ?? s02.street, ''),
    street:      s(s02.street, ''),
    hospital:    s(s02.buildingName, ''),
    hours: typeof s02.hours === 'string' ? s02.hours : (s02.hours && typeof s02.hours === 'object' ? (() => {
      const h = s02.hours as Record<string, { open: string; close: string }>
      const openDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].filter(d => h[d]?.open && h[d]?.close)
      if (!openDays.length) return ''
      const first = openDays[0]; const last = openDays[openDays.length - 1]
      const short = (d: string) => d.slice(0, 3)
      return `${short(first)}–${short(last)}: ${h[first].open} – ${h[first].close}`
    })() : ''),
    hoursSchema,
    hoursObj: (s02.hours && typeof s02.hours === 'object') ? s02.hours : {},
    languages:   s(s02.languages, ''),
    website,
    mapsUrl,
    mapUrl:      mapsUrl,
    mapEmbedUrl: (() => {
      const raw = s(s02.mapEmbedUrl, '')
      if (!raw) return ''
      const match = raw.match(/src="([^"]+)"/)
      return match ? match[1] : raw
    })(),
    medicalSpecialty: s(s02.medicalSpecialty, ''),
    pincode:     s(s02.pincode, ''),
    state:       s(s02.state, ''),
    foundingDate: s(s02.foundingDate, ''),
    geo: { lat: geoLat, lng: geoLng },
    facilities: a(s02.facilities).filter((f: any) => f.title).map((f: any) => ({ title: f.title, description: f.description || '' })),
    insurers: a(s02.insurers).filter((ins: any) => ins.name).map((ins: any, i: number) => ({ name: ins.name })),
    parking:            s(s02.parking, ''),
    wheelchair:         s(s02.wheelchair, ''),
    toilets:            s(s02.toilets, ''),
    pharmacy:           s(s02.pharmacy, ''),
    diagnostics:        s(s02.diagnostics, ''),
    onlineConsultation: s(s02.onlineConsultation, ''),
    social: {
      google:    s(s02.socialGoogle ?? mapsUrl, ''),
      facebook:  s(s02.socialFacebook, ''),
      instagram: s(s02.socialInstagram, ''),
      youtube:   s(s02.socialYoutube, ''),
    },
  }

  // ── Doctor ────────────────────────────────────────────────────────────────
  // s03 = Doctor section in ConfigEditor
  const doctorName    = s(s03.name, 'Doctor')
  const doctorDegrees = a(s03.degrees).map((d: any) => typeof d === 'object' ? (d.degree || d.title || '') : d).filter(Boolean).join(', ')

  const statsList = a(s03.stats)
  const findStat = (keywords: string[]) => {
    const found = statsList.find((st: any) =>
      keywords.some(k => s(st.label, '').toLowerCase().includes(k.toLowerCase()))
    )
    return found ? s(found.number, '') : ''
  }
  const yearsExp       = findStat(['year', 'experience', 'exp'])
  const patientCount   = findStat(['patient', 'happy', 'treated'])
  const procedureCount = findStat(['surgery', 'surgeries', 'procedure', 'operation'])
  const googleRating   = s(s02.ratingValue, '5.0')
  const reviewCount    = s(s02.reviewCount, '')

  const doctor: DoctorInfo = {
    name:        doctorName,
    degrees:     doctorDegrees,
    photo:       s(s03.photo, ''),
    gender:      s(s03.gender, 'Male'),
    honorificPrefix: s(s03.honorificPrefix, 'Dr'),
    profilePath: '/doctor',
    jobTitle:    s(s03.jobTitle, ''),
    description: doctorName && clinic.medicalSpecialty ? `${doctorName}, ${clinic.medicalSpecialty} specialist` : '',
    email:       s(s02.email, ''),
    imageWidth:  800,
    imageHeight: 800,
    specialties: a(s03.specialties),
    knowsAbout:  a(s03.specialties).length ? a(s03.specialties) : [clinic.medicalSpecialty].filter(Boolean),
    qualifications: a(s03.degrees).length
      ? a(s03.degrees).map((d: any) => typeof d === 'object' ? (d.degree || d.title || '') : d).filter(Boolean)
      : doctorDegrees.split(/[,·\-]+/).map((d: string) => d.trim()).filter(Boolean),
    // Degrees as objects for hasCredential schema
    degreesObj: a(s03.degrees).filter((d: any) => d.degree || typeof d === 'string').map((d: any) => ({
      name:        typeof d === 'object' ? s(d.degree, '') : s(d, ''),
      level:       (() => {
        const deg = typeof d === 'object' ? s(d.degree, '') : s(d, '')
        const dl = deg.toLowerCase()
        if (dl.includes('mbbs') || dl.includes('bds') || dl.includes('bams')) return 'Undergraduate'
        if (dl.includes('ms ') || dl.includes('md ') || dl.includes('dnb') || dl.includes('mch')) return 'Postgraduate'
        if (dl.includes('fellowship') || dl.includes('frcs') || dl.includes('mrcs')) return 'Fellowship'
        return 'Postgraduate'
      })(),
      institution: typeof d === 'object' ? s(d.institution, '') : '',
    })),
    languages:   a(s03.languages),
    // Languages as objects for schema
    languagesObj: typeof s03.languages === 'string'
      ? s(s03.languages, '').split(',').map((l: string) => ({ name: l.trim(), code: l.trim().slice(0,2).toLowerCase() })).filter((l: any) => l.name)
      : a(s03.languages).map((l: any) => typeof l === 'string' ? { name: l, code: l.slice(0,2).toLowerCase() } : l),
    nmcNumber:          s(s03.regNumber, ''),
    registrationNumber: s(s03.regNumber, ''),
    ctaLabel:    'Book Appointment',
    stats: a(s03.stats).length ? a(s03.stats).map((st: any) => ({
      number: s(st.number, ''),
      label:  s(st.label, ''),
    })) : [
      { number: yearsExp,       label: 'Years Experience' },
      { number: patientCount,   label: 'Happy Patients'   },
      { number: procedureCount, label: 'Procedures Done'  },
      { number: googleRating + '\u2605', label: 'Google Rating' },
    ],
    details: [
      { icon: 'location', text: `${clinic.name}, ${clinic.area}, ${clinic.city}`, link: mapsUrl },
      { icon: 'clock',    text: clinic.hours },
      { icon: 'language', text: clinic.languages },
    ],
    education:    a(s03.degrees).map((d: any) => typeof d === 'object' ? { degree: d.degree || d.title || '', institution: d.institution || '' } : { degree: d, institution: '' }),
    fellowships:  a(s03.fellowships),
    experience:   a(s03.experience).map((e: any) => typeof e === 'object' ? { role: s(e.role,''), hospital: s(e.hospital,'') } : { role: s(e,''), hospital: '' }),
    certifications: a(s03.certifications),
    workshops:    a(s03.workshops),
    publications: a(s03.publications),
    awards:       a(s03.awards).map((a: any) => typeof a === 'object' ? a : { title: a, year: '' }),
    memberships:  a(s03.memberships),
    faqs:         a(s14.faqs).map((f: any) => ({
      question: s(f.q ?? f.question, ''),
      answer:   s(f.a ?? f.answer,   ''),
    })),
  }

  // ── Hero ──────────────────────────────────────────────────────────────────
  // Hero is auto-generated from s02 + s03 + s00 data
  const specialty = s(s02.medicalSpecialty || s00.entityType, 'Medical')

  const hero: HeroSection = {
    label:       `${clinic.name} · ${clinic.city}`,
    heading:     (s04.headingOverride as string) || (s04.heroHeading as string) || `Advanced ${specialty} Care in`,
    headingEm:   clinic.city,
    subtext:     (s04.subtextOverride as string) || (s04.heroSubtext as string) || `${doctorName} provides expert diagnosis and treatment using the latest technology and a patient-first approach.`,
    tags:        a(s03.degrees).length ? [
      (s03.jobTitle || s03.designation || (typeof a(s03.degrees)[0] === 'object' ? (a(s03.degrees)[0]?.degree || '') : (a(s03.degrees)[0] || ''))),
      yearsExp ? `${yearsExp} Years Experience` : '',
      patientCount ? `${patientCount} Patients Treated` : '',
    ].filter(Boolean) : [],
    ctaLabel:    'Book an Appointment',
    ctaHref:     '#',
    stats: [
      { number: yearsExp,       label: 'Years Experience' },
      { number: patientCount,   label: 'Happy Patients'   },
      { number: procedureCount, label: 'Procedures Done'  },
      { number: googleRating + '\u2605', label: 'Google Rating' },
    ],
    chips: [
      { type: 'rating',     text: `${googleRating} Google Rating`   },
      { type: 'experience', text: yearsExp ? `${yearsExp} Years` : '' },
      { type: 'patients',   text: patientCount ? `${patientCount} Patients` : '' },
    ],
  }

  // ── Trust Strip ───────────────────────────────────────────────────────────
  // s05.items[]
  const TRUST_COLORS = ['#0D9488', '#2563EB', '#7C3AED', '#D97706', '#DC2626']
  const trustStrip = a(s05.items).map((t: any, i: number) => ({
    icon:      s(t.iconType ?? t.icon, 'shield'),
    iconColor: TRUST_COLORS[i % TRUST_COLORS.length],
    text:      s(t.text || t.label || t, ''),
  }))

  // ── Why Choose ────────────────────────────────────────────────────────────
  // s06.items[]
  const WHY_COLORS = ['teal', 'blue', 'deep', 'green'] as const

  // Map specialty keywords to relevant icon sets
  const specialtyLower = specialty.toLowerCase()
  const getSpecialtyIcons = (sp: string): string[] => {
    if (sp.includes('eye') || sp.includes('ophthal') || sp.includes('vision')) return ['eye', 'microscope', 'shield', 'check']
    if (sp.includes('ortho') || sp.includes('bone') || sp.includes('joint') || sp.includes('spine')) return ['activity', 'zap', 'shield', 'check']
    if (sp.includes('cardio') || sp.includes('heart')) return ['heart', 'activity', 'pulse', 'check']
    if (sp.includes('derm') || sp.includes('skin')) return ['sparkles', 'shield', 'user', 'check']
    if (sp.includes('dental') || sp.includes('dentist') || sp.includes('teeth')) return ['smile', 'shield', 'sparkles', 'check']
    if (sp.includes('neuro') || sp.includes('brain')) return ['zap', 'activity', 'shield', 'check']
    if (sp.includes('gastro') || sp.includes('digest') || sp.includes('liver')) return ['activity', 'shield', 'search', 'check']
    if (sp.includes('gyne') || sp.includes('obstet') || sp.includes('women')) return ['heart', 'shield', 'user', 'check']
    if (sp.includes('pediatr') || sp.includes('child')) return ['heart', 'smile', 'shield', 'check']
    if (sp.includes('urol') || sp.includes('kidney')) return ['activity', 'shield', 'search', 'check']
    if (sp.includes('oncol') || sp.includes('cancer')) return ['shield', 'activity', 'heart', 'check']
    if (sp.includes('plastic') || sp.includes('cosmetic') || sp.includes('aesthet')) return ['sparkles', 'user', 'shield', 'check']
    return ['pulse', 'clock', 'user', 'check'] // default
  }
  const WHY_ICONS = getSpecialtyIcons(specialtyLower)

  // Specialty-based icons for conditions, procedures, packages
  const getCPPIcons = (sp: string): string[] => {
    if (sp.includes('ortho') || sp.includes('joint') || sp.includes('bone') || sp.includes('robot')) return ['activity', 'zap', 'shield', 'briefcase', 'pulse', 'first-aid']
    if (sp.includes('cardio') || sp.includes('heart')) return ['pulse', 'activity', 'heart', 'shield', 'zap', 'stethoscope']
    if (sp.includes('neuro') || sp.includes('brain') || sp.includes('spine')) return ['brain', 'activity', 'shield', 'zap', 'pulse', 'eye']
    if (sp.includes('derm') || sp.includes('skin')) return ['shield', 'droplet', 'leaf', 'eye', 'activity', 'zap']
    if (sp.includes('ophthal') || sp.includes('eye')) return ['eye', 'shield', 'zap', 'activity', 'pulse', 'stethoscope']
    if (sp.includes('dental') || sp.includes('dent')) return ['shield', 'zap', 'activity', 'briefcase', 'pulse', 'first-aid']
    if (sp.includes('gyn') || sp.includes('obst')) return ['heart', 'shield', 'activity', 'pulse', 'leaf', 'stethoscope']
    if (sp.includes('ent') || sp.includes('ear') || sp.includes('nose')) return ['activity', 'shield', 'pulse', 'zap', 'stethoscope', 'first-aid']
    if (sp.includes('gastro') || sp.includes('digest')) return ['activity', 'shield', 'pulse', 'droplet', 'stethoscope', 'zap']
    if (sp.includes('urol') || sp.includes('kidney')) return ['activity', 'shield', 'droplet', 'zap', 'pulse', 'stethoscope']
    if (sp.includes('oncol') || sp.includes('cancer')) return ['shield', 'activity', 'pulse', 'zap', 'stethoscope', 'first-aid']
    if (sp.includes('pediatr') || sp.includes('child')) return ['heart', 'shield', 'activity', 'pulse', 'first-aid', 'stethoscope']
    return ['activity', 'shield', 'pulse', 'zap', 'stethoscope', 'briefcase']
  }
  const CPP_ICONS = getCPPIcons(specialtyLower)

  const whyChoose = a(s06.items).map((w: any, i: number) => ({
    iconColor:   WHY_COLORS[i % 4] as 'teal' | 'blue' | 'deep' | 'green',
    iconType:    s(w.iconType, WHY_ICONS[i % 4]),
    title:       s(w.title, ''),
    description: s(w.text ?? w.description, ''),
  }))

  // ── Conditions ────────────────────────────────────────────────────────────
  // s07.conditions[]
  const conditionList = a(s07.conditions)
  const photos = raw?.photos ?? {}
  const conditions = conditionList.map((c: any, i: number) => {
    const label = s(c.name ?? c.title, `condition-${i}`)
    const slug = s(c.slug, slugify(label))
    const photoKey = `condition_${slug}`
    return {
      slug,
      href:        `/conditions/${slug}`,
      gradClass:   g(i),
      iconType:    s(c.iconType, CPP_ICONS[i % CPP_ICONS.length]),
      label,
      title:       label,
      description: s(c.descriptionShort ?? c.description, ''),
      image:       s(photos[photoKey] ?? c.heroImage, ''),
    }
  })

  const servicesConditions = conditionList.map((c: any, i: number) => {
    const label = s(c.name ?? c.title, `condition-${i}`)
    const slug = s(c.slug, slugify(label))
    const photoKey = `condition_${slug}`
    return {
      title:       label,
      description: s(c.descriptionLong ?? c.description, ''),
      slug,
      gradient:    gs(i),
      image:       s(photos[photoKey] ?? c.heroImage, ''),
      iconType:    s(c.iconType, CPP_ICONS[i % CPP_ICONS.length]),
    }
  })

  // ── Procedures ────────────────────────────────────────────────────────────
  // s08.procedures[]
  const procedureList = a(s08.procedures)
  const procedures = procedureList.map((p: any, i: number) => {
    const label = s(p.name ?? p.title, `procedure-${i}`)
    const slug = s(p.slug, slugify(label))
    const photoKey = `procedure_${slug}`
    return {
      slug,
      href:        `/procedures/${slug}`,
      gradClass:   g(i),
      iconType:    s(p.iconType, CPP_ICONS[i % CPP_ICONS.length]),
      label,
      title:       label,
      description: s(p.descriptionShort ?? p.description, ''),
      image:       s(photos[photoKey] ?? p.heroImage, ''),
    }
  })

  const servicesProcedures = procedureList.map((p: any, i: number) => {
    const label = s(p.name ?? p.title, `procedure-${i}`)
    const slug = s(p.slug, slugify(label))
    const photoKey = `procedure_${slug}`
    return {
      title:       label,
      description: s(p.descriptionLong ?? p.description, ''),
      slug,
      gradient:    gs(i),
      image:       s(photos[photoKey] ?? p.heroImage, ''),
      iconType:    s(p.iconType, CPP_ICONS[i % CPP_ICONS.length]),
    }
  })

  // ── Packages ──────────────────────────────────────────────────────────────
  // s10.packages[]
  const packageList = a(s10.packages)
  const packages = packageList.map((p: any, i: number) => {
    const label = s(p.name ?? p.title, `package-${i}`)
    const slug = s(p.slug, slugify(label))
    const photoKey = `package_${slug}`
    return {
      slug,
      href:        `/packages/${slug}`,
      gradClass:   g(i),
      iconType:    s(p.iconType, CPP_ICONS[i % CPP_ICONS.length]),
      title:       label,
      description: s(p.description, ''),
      price:       s(p.price, ''),
      tags:        a(p.tags ?? p.features),
      image:       s(photos[photoKey] ?? p.heroImage, ''),
    }
  })

  const productPackages = packageList.map((p: any, i: number) => {
    const slug = s(p.slug, slugify(s(p.title, `package-${i}`)))
    return {
      name:        s(p.title, ''),
      description: s(p.description, ''),
      slug,
      gradient:    gs(i),
      price:       s(p.price, ''),
      includes:    a(p.includes ?? p.tags ?? p.features),
    }
  })

  // ── How We Work ───────────────────────────────────────────────────────────
  // s11.steps[]
  const HWW_ICONS = ['message', 'search', 'file', 'check-circle']
  const howWeWork = a(s11.steps).map((step: any, i: number) => ({
    badge:       s(step.badge, `Step ${i + 1 < 10 ? '0' + (i + 1) : i + 1}`),
    iconType:    s(step.iconType, HWW_ICONS[i % HWW_ICONS.length]),
    title:       s(step.title, ''),
    description: s(step.text ?? step.description, ''),
  }))

  // ── Clinical Info ─────────────────────────────────────────────────────────
  // s12.cards[]
  const CLI_FIXED = [
    { colorClass: 'cl-green', iconType: 'pulse', title: 'Success Rates' },
    { colorClass: 'cl-amber', iconType: 'alert', title: 'Possible Risks' },
    { colorClass: 'cl-blue',  iconType: 'info',  title: 'Side Effects'  },
  ] as const
  const clinicalCards = a(s12.cards)
  const clinicalInfo = CLI_FIXED.map((fixed, i) => ({
    ...fixed,
    iconType:    s(clinicalCards[i]?.iconType, fixed.iconType),
    colorClass:  s(clinicalCards[i]?.colorClass, fixed.colorClass),
    description: s(clinicalCards[i]?.text ?? clinicalCards[i]?.description, ''),
    note:        s(clinicalCards[i]?.note ?? clinicalCards[i]?.value, ''),
  }))

  // ── Patient Stories ───────────────────────────────────────────────────────
  // s16 (patient stories)
  const storyList = a(s16.stories ?? s16.items ?? [])
  const patientStories = storyList.map((story: any, i: number) => ({
    gradClass: g(i),
    duration:  s(story.duration, ''),
    title:     s(story.title, ''),
    tag:       s(story.tag, ''),
    videoUrl:  s(story.videoUrl, ''),
  }))

  const successStories = {
    videoCount:     s(s16.videoCount, `${storyList.length}+`),
    conditionCount: s(s16.conditionCount, ''),
    rating:         googleRating,
    stories: storyList.map((story: any, i: number) => ({
      gradient:    gs(i),
      duration:    s(story.duration, ''),
      tag:         s(story.tag, ''),
      tagType:     (story.tagType === 'condition' ? 'condition' : 'procedure') as 'condition' | 'procedure',
      category:    s(story.category, ''),
      title:       s(story.title, ''),
      description: s(story.description, ''),
    })),
  }

  // ── Pricing ───────────────────────────────────────────────────────────────
  // s15.sections[]
  const consultationFee = s(s02.consultationFee, '')
  const allCosts = [
    ...a(s08.procedures).map((p: any) => parseFloat(s(p.cost, '0'))),
    ...a(s10.packages).map((p: any) => parseFloat(s(p.price, '0'))),
  ].filter((n: number) => n > 0)
  const minCost = allCosts.length ? Math.min(...allCosts) : null
  const maxCost = allCosts.length ? Math.max(...allCosts) : null
  const insurerNames = a(s02.insurers).map((ins: any) => s(ins.name, '')).filter(Boolean)
  const pricing = [
    {
      barClass: 'acc-teal' as const,
      iconType: 'stethoscope',
      title: 'Consultation Fee',
      description: consultationFee ? `Rs.${consultationFee} per consultation` : 'Contact us for consultation fee details.',
      points: [
        consultationFee ? `Rs.${consultationFee} per visit` : 'Fee communicated at time of booking',
        'No hidden charges',
        'Detailed treatment plan provided after consultation',
      ],
    },
    {
      barClass: 'acc-blue' as const,
      iconType: 'briefcase',
      title: 'Procedure & Package Charges',
      description: minCost && maxCost
        ? `Rs.${minCost.toLocaleString('en-IN')} - Rs.${maxCost.toLocaleString('en-IN')} approximate range`
        : 'Cost varies based on procedure and complexity.',
      points: [
        minCost && maxCost ? `Approximate range: Rs.${minCost.toLocaleString('en-IN')} - Rs.${maxCost.toLocaleString('en-IN')}` : 'Costs vary by procedure and individual condition',
        'Exact estimate provided after first consultation',
        'Transparent cost breakdown before any procedure begins',
        'No surprise charges',
      ],
    },
    {
      barClass: 'acc-vibrant' as const,
      iconType: 'shield',
      title: 'Insurance',
      description: insurerNames.length > 0 ? `${insurerNames.join(', ')} accepted` : 'Check with us regarding your insurance details.',
      points: [
        ...(insurerNames.length > 0 ? [`Accepted: ${insurerNames.join(', ')}`] : []),
        'Check with us regarding your insurance details',
        'Our team will help verify your coverage',
      ],
    },
  ]

  // ── Reviews ───────────────────────────────────────────────────────────────
  // s13.reviews[]
  const reviewList = a(s13.reviews)
  const reviews = reviewList.map((r: any, i: number) => ({
    initials: s(r.initials, initials(s(r.name, ''))),
    name:     s(r.name, ''),
    date:     s(r.date, ''),
    text:     s(r.text ?? r.review, ''),
    gradient: gs(i),
  }))

  const reviewSummary = {
    score:     googleRating,
    count:     reviewCount ? `Based on ${reviewCount} Google Reviews` : '',
    googleUrl: s(s02.googleReviewLink ?? s02.socialGoogle, ''),
  }

  const testimonials = {
    rating:      googleRating,
    reviewCount,
    googleUrl:   s(s02.googleReviewLink ?? s02.socialGoogle, ''),
    reviews,
  }

  // ── Local Areas ───────────────────────────────────────────────────────────
  // s17.areas[]
  const areaList = a(s17.areas)
  const localAreas = areaList.map((ar: any) => {
    const name = s(ar.area ?? ar.name, '')
    const slug = s(ar.slug, slugify(name))
    return {
      name,
      slug,
      distance: s(ar.distance, ''),
      duration: s(ar.duration, ''),
      label:    name,
      href:     `/specialist-near-${slug}`,
    }
  })

  // ── FAQ ───────────────────────────────────────────────────────────────────
  // s14.faqs[] — ConfigEditor saves q/a, fallback to question/answer
  const faq = a(s14.faqs).map((f: any) => ({
    question: s(f.q ?? f.question, ''),
    answer:   s(f.a ?? f.answer,   ''),
  }))

  // ── Blog ──────────────────────────────────────────────────────────────────
  // s18.posts[]
  const blog = a(s18.posts).map((b: any, i: number) => ({
    href:      `/blog/${s(b.slug, slugify(s(b.title, `post-${i}`)))}`,
    gradStyle: gs(i),
    date:      s(b.date, ''),
    title:     s(b.title, ''),
    excerpt:   s(b.excerpt, ''),
  }))

  // ── CTA Band ──────────────────────────────────────────────────────────────
  const ctaBand = {
    heading:       'Ready to take the first step?',
    subtext:       `Book an appointment with ${doctorName} today.`,
    primaryLabel:  'Book Appointment',
    primaryHref:   '#',
    secondaryLabel:'WhatsApp Us',
    secondaryHref: `https://wa.me/${whatsapp}`,
    infoItems:     [
      clinic.area ? `${clinic.area}, ${clinic.city}` : clinic.city,
      clinic.hours,
    ].filter(Boolean),
    info: [
      clinic.area ? `${clinic.area}, ${clinic.city}` : clinic.city,
      clinic.hours,
    ].filter(Boolean),
  }

  // ── Team ──────────────────────────────────────────────────────────────────
  // s21.members[]
  const team = a(s21.members).map((m: any, i: number) => ({
    name:           s(m.name, ''),
    designation:    s(m.designation, ''),
    qualifications: a(m.qualifications),
    experience:     s(m.experience, ''),
    schedule:       s(m.schedule, ''),
    gradient:       gt(i),
    isLead:         Boolean(m.isLead),
    photo:          '',
  }))

  // ── Locations ─────────────────────────────────────────────────────────────
  // For solo clinics, build a single location from s02 data
  const locations = [{
    name:        clinic.name,
    slug:        slugify(clinic.name),
    address:     clinic.address,
    phone:       clinic.phone,
    hours:       clinic.hours,
    mapUrl:      mapsUrl,
    mapEmbedUrl: clinic.mapEmbedUrl,
    isPrimary:   true,
  }]

  // ── Optional Pages ────────────────────────────────────────────────────────
  const optionalPages = {
    gallery:      Boolean(s00.galleryEnabled),
    testimonials: true,
  }

  // ── Brand ─────────────────────────────────────────────────────────────────
  const brand = {
    primaryColor:   s(s00.primaryColor,   '#0d7a5f'),
    secondaryColor: s(s00.secondaryColor, '#1a4ea0'),
  }

  // ── Assemble ──────────────────────────────────────────────────────────────
  // ── Entity (for schema markup) ───────────────────────────────────────────
  const entity = {
    medicalSpecialty: s(s02.medicalSpecialty, ''),
    bodyLocation:     s(s02.bodyLocation, ''),
    registrationState: s(s02.state, ''),
    foundingDate:     s(s02.foundingDate, ''),
  }

  return {
    brand,
    clinic,
    doctor,
    entity,
    hero,
    trustStrip,
    whyChoose,
    conditions,
    procedures,
    packages,
    howWeWork,
    clinicalInfo,
    patientStories,
    pricing,
    reviews,
    reviewSummary,
    localAreas,
    faq,
    blog,
    ctaBand,
    services: {
      conditions: servicesConditions,
      procedures: servicesProcedures,
    },
    productPackages,
    testimonials,
    successStories,
    areas:        localAreas,
    team,
    locations,
    optionalPages,
    photos:       {},
  }
}

// ─────────────────────────────────────────────────────────────
// REPLACE the three map functions at the bottom of lib/transform.ts
// Replace from the line: "export function mapCondition("
// through to the end of the file
// ─────────────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────

/** Pull clinic context fields shared by all three page types */

function stripCite(val: any): string {
  if (typeof val !== "string") return ""
  return val.replace(/<cite[^>]*>(.*?)<\/cite>/gs, "$1").trim()
}

function clinicContext(rawConfig: any) {
  const s02 = rawConfig?.s02 ?? {}
  const s03 = rawConfig?.s03 ?? {}
  const s23 = rawConfig?.s23 ?? {}

  const prefix    = s(s03.honorificPrefix ?? 'Dr')
  const firstName = s(s03.firstName, '')
  const lastName  = s(s03.lastName, '')
  const doctorName = [prefix, firstName, lastName].filter(Boolean).join(' ').trim() || 'Our Doctor'

  const phone      = s(s02.telephone ?? s02.phone ?? s02.mobilePhone, '')
  const whatsapp   = s(s02.whatsapp, phone.replace(/\D/g, ''))
  const clinicName = s(s02.brandName ?? s02.name, '')
  const city       = s(s02.city, '')
  const address    = [s(s02.buildingName,''), s(s02.street,''), city].filter(Boolean).join(', ')
  const hours      = typeof s02.hours === 'string' ? s02.hours
                   : (s02.hours && typeof s02.hours === 'object') ? 'Mon–Sat: 9:00 AM – 8:00 PM'
                   : ''

  return {
    clinicName,
    clinicAddress: address,
    clinicHours:   hours,
    whatsappNumber: whatsapp || phone.replace(/\D/g, ''),
    appointmentUrl: '/appointment',
  }
}

/** Safely get string */

/** Safely get array */

/** Strip <cite ...>...</cite> tags from AI-generated content */

// ── mapCondition ─────────────────────────────────────────────
/**
 * Maps one item from s07.conditions[] + full rawConfig
 * → props for ConditionDetail component
 */
export function mapCondition(
  conditionItem: any,
  rawConfig: any,
  photoUrl: string | null = null
) {
  const c    = conditionItem ?? {}
  const s08  = rawConfig?.s08 ?? {}
  const procs: any[] = a(s08.procedures)

  // Auto-link related procedures by slug or name match
  const relatedProcedures = procs
    .filter(p => {
      const related: string[] = a(c.relatedProcedures)
      return related.some(rn => p.slug === rn || p.name?.toLowerCase().includes(rn.toLowerCase()))
    })
    .map(p => ({ name: s(p.name), slug: s(p.slug) }))
    .slice(0, 4)

  // treatments: map to new shape {name, description, invasiveness, invasivenessStyle, items}
  const treatments = a(c.treatments).slice(0, 4).map((t: any) => ({
    name:        s(t.name),
    shortDescription: stripCite(t.shortDescription ?? t.description),
    description: stripCite(t.description),
    invasiveness: s(t.invasiveness ?? t.type),
    invasivenessStyle: (() => {
      const inv = s(t.invasiveness ?? t.type).toUpperCase()
      if (inv.includes('SURGICAL')) return { background: '#FEF2F2', color: '#DC2626' }
      if (inv.includes('MODERATE')) return { background: '#FEF3C7', color: '#D68910' }
      return { background: '#F0FDFA', color: '#3CB8AF' }
    })(),
    items: a<string>(t.items ?? t.bullets ?? t.details),
  }))

  // howWeHandle: map to {title, description}
  const howWeHandle = a(c.howWeHandle).slice(0, 4).map((h: any) => ({
    title:       s(h.title ?? h.step),
    description: s(h.description),
  }))

  // recoveryPhases: map to {label, title, description, timeline[], warnings[]}
  const recoveryPhases = a(c.recoveryPhases ?? c.recovery).slice(0, 3).map((r: any) => ({
    label:       s(r.label ?? r.phase),
    title:       s(r.title ?? r.phase),
    description: stripCite(r.description),
    timeline: a(r.timeline).map((row: any) => ({
      badge: s(row.badge ?? row.label),
      text:  s(row.text),
    })),
    warnings: a<string>(r.warnings),
  }))

  // whenToSeeDoctor: old shape was string, new shape is {intro?, items?[]}
  const wtsRaw = c.whenToSeeDoctor
  const whenToSeeDoctor = typeof wtsRaw === 'string'
    ? { intro: stripCite(wtsRaw), items: [] }
    : wtsRaw && typeof wtsRaw === 'object'
    ? { intro: stripCite(wtsRaw.intro), items: a<string>(wtsRaw.items) }
    : undefined

  return {
    name:        s(c.name),
    icd10Code:       s(c.icd10 ?? c.icd10Code),
    prevalence:      stripCite(c.prevalence),
    progressionType: stripCite(c.progressionType),
    diagnosisMethod: stripCite(c.diagnosisMethod),
    slug:        s(c.slug),
    description: stripCite(c.description ?? c.descriptionLong ?? c.shortDescription),
    heroImage:   photoUrl ?? s(c.heroImage) ?? null,
    pills:       a<string>(c.pills).slice(0, 3),
    heroStats:   a(c.heroStats).slice(0, 3).map((st: any) => ({
      label: s(st.label), value: s(st.value),
    })),
    types: a(c.types).slice(0, 3).map((t: any) => ({
      name:        s(t.name),
      description: stripCite(t.description),
    })),
    causes:      a<string>(c.causes),
    symptoms: {
      early:    a<string>(c.symptoms?.early),
      moderate: a<string>(c.symptoms?.moderate),
      advanced: a<string>(c.symptoms?.advanced),
    },
    treatments,
    howWeHandle,
    recoveryPhases,
    outcomes: a(c.outcomes).slice(0, 4).map((o: any) => ({
      title:       s(o.title),
      description: stripCite(o.description),
    })),
    ifNotTreated:    stripCite(c.ifNotTreated) || undefined,
    whenToSeeDoctor,
    relatedProcedures,
    faqs: a(c.faqs).slice(0, 5).map((f: any) => ({
      question: stripCite(f.question ?? f.q),
      answer:   stripCite(f.answer ?? f.a),
    })),
    ...clinicContext(rawConfig),
  }
}

// ── mapProcedure ─────────────────────────────────────────────
/**
 * Maps one item from s08.procedures[] + full rawConfig
 * → props for ProcedureDetail component
 */
export function mapProcedure(
  procedureItem: any,
  rawConfig: any,
  photoUrl: string | null = null
) {
  const p   = procedureItem ?? {}
  const s07 = rawConfig?.s07 ?? {}
  const conds: any[] = a(s07.conditions)

  // Auto-link related conditions
  const relatedConditions = conds
    .filter(c => {
      const related: string[] = a(p.relatedConditions)
      return related.some(rn => c.slug === rn || c.name?.toLowerCase().includes(rn.toLowerCase()))
    })
    .map(c => ({ name: s(c.name), slug: s(c.slug) }))
    .slice(0, 4)

  // quickFacts: build from individual fields
  const quickFacts = [
    p.anaesthesia   && { label: 'Anaesthesia',      value: stripCite(p.anaesthesia) },
    p.duration      && { label: 'Procedure Duration',value: stripCite(p.duration) },
    p.hospitalStay  && { label: 'Hospital Stay',     value: stripCite(p.hospitalStay) },
    p.recoveryTime  && { label: 'Return to Work',    value: stripCite(p.recoveryTime) },
    p.fullRecovery  && { label: 'Full Recovery',     value: stripCite(p.fullRecovery) },
    p.successRate   && { label: 'Success Rate',      value: stripCite(p.successRate) },
  ].filter(Boolean) as { label: string; value: string }[]

  // candidacy: could be string[] or string
  const candidacy = Array.isArray(p.candidacy)
    ? a<string>(p.candidacy).map(stripCite)
    : typeof p.whoNeedsIt === 'string' && p.whoNeedsIt
    ? stripCite(p.whoNeedsIt).split(/(?<=[.!?])\s+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : []

  // successRateItems / risksItems / sideEffectsItems
  const successRateItems = Array.isArray(p.successRateItems)
    ? a<string>(p.successRateItems).map(stripCite)
    : typeof p.successRate === 'string' && p.successRate
    ? [stripCite(p.successRate)]
    : []

  const risksItems     = a<string>(p.risks ?? p.risksItems).map(stripCite)
  const sideEffectsItems = a<string>(p.sideEffects ?? p.sideEffectsItems).map(stripCite)

  // steps (How It Works numbered stepper): {title, description}
  const steps = a(p.howItWorks ?? p.steps).slice(0, 5).map((st: any) => ({
    title:       s(st.title ?? st.step),
    description: stripCite(st.description),
  }))

  // timelines (Duration cards): {label, value, description}
  const timelines = a(p.durationMilestones ?? p.timelines).slice(0, 6).map((tl: any) => ({
    label:       stripCite(tl.milestone ?? tl.label),
    value:       stripCite(tl.timeframe ?? tl.duration ?? tl.value),
    description: stripCite(tl.description),
  }))

  // howWeHandle: {title, description}
  const howWeHandle = a(p.howWeHandle).slice(0, 4).map((h: any) => ({
    title:       s(h.title ?? h.step),
    description: stripCite(h.description),
  }))

  // recoveryPhases: {label, title, description, timeline[], warnings[]}
  const recoveryPhases = a(p.recoveryPhases ?? p.recovery).slice(0, 3).map((r: any) => ({
    label:       s(r.label ?? r.phase),
    title:       s(r.title ?? r.phase),
    description: stripCite(r.description),
    timeline: a(r.timeline).map((row: any) => ({
      badge: s(row.badge ?? row.label),
      text:  stripCite(row.text),
    })),
    warnings: a<string>(r.warnings).map(stripCite),
  }))

  // myths: {myth, fact} — old shape was misconceptions: {myth, reality}
  const myths = a(p.misconceptions ?? p.myths).slice(0, 5).map((m: any) => ({
    myth: stripCite(m.myth),
    fact: stripCite(m.fact ?? m.reality),
  }))

  // ifDelayed
  const ifd = p.ifNotTreated ?? p.ifDelayed
  const ifDelayed = ifd
    ? typeof ifd === 'string'
      ? { items: ifd.split('\n').map((l: string) => stripCite(l.trim())).filter(Boolean) }
      : { title: s(ifd.title), intro: stripCite(ifd.intro), items: a<string>(ifd.items).map(stripCite) }
    : undefined

  return {
    name:        s(p.name),
    slug:        s(p.slug),
    description: stripCite(p.shortDescription ?? p.shortdescription ?? p.description ?? p.descriptionLong),
    heroImage:   photoUrl ?? s(p.heroImage) ?? null,
    pills:       a<string>(p.pills).slice(0, 3),
    heroStats:   a(p.heroStats).slice(0, 3).map((st: any) => ({
      label: s(st.label), value: s(st.value),
    })),
    quickFacts,
    candidacy,
    candidacyIntro: s(p.candidacyIntro),
    successRateItems,
    risksItems,
    sideEffectsItems,
    riskNote:    s(p.riskNote),
    steps,
    timelines,
    howWeHandle,
    recoveryPhases,
    outcomes: a(p.outcomes).slice(0, 4).map((o: any) => ({
      title:       s(o.title),
      description: stripCite(o.description),
    })),
    myths,
    ifDelayed,
    relatedConditions,
    faqs: a(p.faqs).slice(0, 5).map((f: any) => ({
      question: stripCite(f.question ?? f.q),
      answer:   stripCite(f.answer ?? f.a),
    })),
    ...clinicContext(rawConfig),
  }
}

// ── mapPackage ───────────────────────────────────────────────
/**
 * Maps one item from s10.packages[] + full rawConfig
 * → props for PackageDetail component
 */
export function mapPackage(
  packageItem: any,
  rawConfig: any,
  photoUrl: string | null = null
) {
  const pk  = packageItem ?? {}
  const s08 = rawConfig?.s08 ?? {}
  const procs: any[] = a(s08.procedures)

  // Related procedures: match by slug or name
  const relatedProcedures = procs
    .filter(p => {
      const related: string[] = a(pk.relatedProcedures)
      return related.some(rn => p.slug === rn || p.name?.toLowerCase().includes(rn.toLowerCase()))
    })
    .map(p => ({ name: s(p.name), slug: s(p.slug) }))
    .slice(0, 4)

  // inclusions: old shape whatsIncluded[{category, items[]}] — same shape, just ensure arrays
  const inclusions = a(pk.whatsIncluded ?? pk.inclusions).slice(0, 4).map((inc: any) => ({
    category: s(inc.category ?? inc.title),
    items:    a<string>(inc.items),
  }))

  // howItWorks: {title, description}
  const howItWorks = a(pk.howItWorks ?? pk.steps).slice(0, 4).map((h: any) => ({
    title:       s(h.title ?? h.step),
    description: s(h.description),
  }))

  // whoIsItFor: old shape was string, new is string[]
  const whoIsItFor = Array.isArray(pk.whoIsItFor)
    ? a<string>(pk.whoIsItFor)
    : typeof pk.whoIsItFor === 'string' && pk.whoIsItFor
    ? pk.whoIsItFor.split(/\n/).map((l: string) => l.trim()).filter(Boolean)
    : []

  // pricingRows: [{label, value}]
  const pricingRows = a(pk.pricingBreakdown).map((row: any) => ({
    label: s(row.item ?? row.label),
    value: s(row.amount ?? row.price ?? row.value),
  }))

  // pricingTotal
  const pricingTotal = pk.totalPrice || pk.price
    ? { label: 'Total Package Range', value: (() => { const v = s(pk.totalPrice ?? pk.price); return v && !v.includes('₹') && /^[0-9,]+$/.test(v.trim()) ? '₹' + v : v; })() }
    : undefined

  // paymentOptions: old shape was string[], new is {title, items[]}[]
  const paymentOptions = Array.isArray(pk.paymentOptions)
    ? a(pk.paymentOptions).map((opt: any) =>
        typeof opt === 'string'
          ? { title: opt, items: [] }
          : { title: s(opt.title), items: a<string>(opt.items) }
      )
    : []

  // testimonials: {name, detail, text, rating}
  const testimonials = a(pk.testimonials).slice(0, 2).map((t: any) => ({
    name:   s(t.name),
    detail: s(t.detail ?? t.subtitle ?? t.procedure ?? ''),
    text:   s(t.text ?? t.review),
    rating: typeof t.rating === 'number' ? t.rating : 5,
  }))

  return {
    name:        s(pk.name ?? pk.title),
    slug:        s(pk.slug),
    description: stripCite(pk.shortDescription ?? pk.shortdescription ?? pk.description),
    heroImage:   photoUrl ?? s(pk.heroImage) ?? null,
    pills:       a<string>(pk.pills).slice(0, 3),
    priceRange:  (() => { const v = s(pk.priceRange ?? pk.price); return v && !v.includes('₹') && /^[0-9,]+$/.test(v.trim()) ? '₹' + v : v; })(),
    priceUnit:   s(pk.priceUnit ?? 'per procedure'),
    inclusions,
    howItWorks,
    whoIsItFor,
    pricingTitle:    s(pk.name ?? pk.title),
    pricingSubtitle: s(pk.pricingSubtitle ?? 'Complete cost structure'),
    pricingRows,
    pricingTotal,
    pricingNote:     s(pk.pricingNote),
    paymentOptions,
    testimonials,
    relatedProcedures,
    faqs: a(pk.faqs).slice(0, 5).map((f: any) => ({
      question: stripCite(f.question ?? f.q),
      answer:   stripCite(f.answer ?? f.a),
    })),
    ...clinicContext(rawConfig),
  }
}
