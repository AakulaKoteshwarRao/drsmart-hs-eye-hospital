/**
 * SCHEMA CONFIG — builds schema config from runtime ClinicConfig
 * Called with the loaded config object (from Supabase or default.json).
 * Falls back to default.json static export for backwards compatibility.
 */

import defaultData from '../../data/templatedefault.json'

const LANG_CODES = {
  english: 'en', hindi: 'hi', telugu: 'te', tamil: 'ta',
  kannada: 'kn', malayalam: 'ml', marathi: 'mr', bengali: 'bn',
  gujarati: 'gu', punjabi: 'pa', urdu: 'ur', odia: 'or',
}

function parseLangs(str) {
  if (!str) return [{ name: '[Language]', code: 'xx' }]
  return str.split(/[·,\/]/).map(s => s.trim()).filter(Boolean).map(name => ({
    name,
    code: LANG_CODES[name.toLowerCase()] || name.slice(0, 2).toLowerCase(),
  }))
}

/**
 * Build schema config from a ClinicConfig object.
 * @param {object} cfg - full ClinicConfig (from loadConfig or default.json)
 */
export function buildSchemaConfig(cfg) {
  const d = cfg ?? defaultData
  const clinic = d.clinic  ?? {}
  const doctor = d.doctor  ?? {}
  const entity = d.entity  ?? {}

  const clinicLanguages = parseLangs(clinic.languages || (doctor.languages ?? []).join(' · '))
  const doctorLanguages = Array.isArray(doctor.languages)
    ? doctor.languages.map(name => ({
        name,
        code: LANG_CODES[name.toLowerCase()] || name.slice(0, 2).toLowerCase(),
      }))
    : clinicLanguages

  return {
    site: {
      url:       clinic.website || 'https://[domain].com',
      blogPath:  '/blog',
      searchUrl: '/search?q={search_term_string}',
    },

    clinic: {
      name:           clinic.name,
      alternateName:  clinic.tagline || clinic.name,
      logo:           `${clinic.website}/images/logo.png`,
      logoWidth:      400,
      logoHeight:     80,
      image:          `${clinic.website}/images/clinic.jpg`,
      imageWidth:     1200,
      imageHeight:    800,
      description:    `${clinic.name} -- ${clinic.tagline}`,
      email:          clinic.email,
      telephone:      clinic.phone,
      foundingDate:   entity.foundingDate || '',
      priceRange:     '$$',
      specialty:      entity.medicalSpecialty || doctor.experience?.[0]?.role || 'Medical Practice',
      serviceType:    entity.medicalSpecialty ? entity.medicalSpecialty + ' Service' : 'Medical Service',
      mapUrl:         clinic.mapsUrl || clinic.mapUrl || '',
      bookingUrl:     `${clinic.website}/appointment`,
      currenciesAccepted: 'INR',
      paymentAccepted:    'Cash, Credit Card, Debit Card, UPI',
      languages:      clinicLanguages,
      address: {
        street:  clinic.street  || clinic.address || '',
        city:    clinic.city    || '',
        state:   entity.registrationState || '',
        pincode: clinic.pincode || '',
        country: 'IN',
      },
      geo: {
        latitude:  clinic.geo?.latitude  || 0,
        longitude: clinic.geo?.longitude || 0,
      },
      hours: clinic.hoursSchema || [],
      social: {
        google: d.reviewSummary?.googleUrl || clinic.website || '',
      },
      rating: {
        value: parseFloat(d.reviewSummary?.score) || 0,
        count: parseInt(d.reviewSummary?.count)   || 0,
        best:  5,
        worst: 1,
      },
      faq: (d.faq || []).slice(0, 6).map(f => ({ q: f.question, a: f.answer })),
    },

    doctor: {
      name:               doctor.name,
      honorificPrefix:    'Dr.',
      image:              doctor.photo || `${clinic.website}/images/doctor.jpg`,
      imageWidth:         800,
      imageHeight:        800,
      jobTitle:           doctor.experience?.[0]?.role || entity.medicalSpecialty || 'Medical Specialist',
      gender:             doctor.gender || '',
      description:        `${doctor.name} -- ${doctor.degrees}`,
      email:              clinic.email,
      profilePath:        '/about',
      registrationNumber: doctor.registrationNumber || doctor.nmcNumber || '',
      degrees:            (doctor.qualifications || []).map(q => ({
        name: q, institution: '', level: 'Postgraduate',
      })),
      awards:      doctor.awards      || [],
      memberships: doctor.memberships || [],
      knowsAbout:  doctor.specialties || (d.conditions || []).slice(0, 4).map(c => c.title || c.label),
      languages:   doctorLanguages,
    },

    reviews: (d.reviews || []).slice(0, 5).map(r => ({
      author: r.name,
      rating: 5,
      text:   r.text,
      date:   r.date || '',
    })),

    services: (d.services?.conditions || []).map(svc => ({
      slug:        svc.slug,
      name:        svc.title,
      description: svc.description || svc.title,
      output:      `Improved ${(svc.title || '').toLowerCase()} outcomes`,
      areas:       (d.localAreas || []).map(a => a.name),
      offer: { price: 0, description: `Consultation for ${svc.title}` },
      faq: [],
    })),

    procedures: (d.procedures || []).map(p => {
      const slug = p.href?.replace('/procedures/', '') || (p.label || '').toLowerCase().replace(/\s+/g, '-')
      return {
        slug,
        name:              p.title || p.label,
        alternateName:     p.label,
        description:       p.description,
        type:              'SurgicalProcedure',
        bodyLocation:      entity.bodyLocation || '',
        preparation:       'Consult your doctor before the procedure.',
        followup:          'Follow post-operative care instructions.',
        howPerformed:      p.description,
        prognosis:         'Outcomes vary; consult your physician.',
        contraindications: [],
        cost: { price: 0, minPrice: 0, maxPrice: 0 },
        faq: [],
      }
    }),

    conditions: (d.conditions || []).map(c => {
      const slug = c.href?.replace('/conditions/', '') || (c.label || '').toLowerCase().replace(/\s+/g, '-')
      return {
        slug,
        name:          c.title || c.label,
        alternateName: c.label,
        description:   c.description,
        icdCode:       '',
        anatomy:       entity.bodyLocation || '',
        symptoms:      [], treatments: [], risks: [], complications: [],
        epidemiology:  '', prognosis: '', faq: [],
      }
    }),

    locations: (d.localAreas || []).slice(0, 5).map(area => ({
      slug:        area.slug,
      name:        `${doctor.name} -- ${entity.medicalSpecialty || 'Specialist'} in ${area.name}`,
      area:        area.name,
      areasServed: [area.name],
      url:         `${clinic.website}/locations/${area.slug}`,
      faq: [],
    })),
  }
}

// Static export for backwards compatibility (pages that import schemaConfig directly)
export const schemaConfig = buildSchemaConfig(defaultData)
