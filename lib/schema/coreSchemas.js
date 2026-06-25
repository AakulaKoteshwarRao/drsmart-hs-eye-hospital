/**
 * CORE SCHEMAS — WebSite + MedicalClinic + Physician
 *
 * N9:  WebSite.publisher added → MedicalClinic
 * N10: MedicalClinic.logo ImageObject gets @id
 * N11: MedicalClinic.image ImageObject gets @id
 * N12: Review nodes get @id
 * N2:  contactPoint.contactType: 'customer service' → 'customer support'
 * N13: Physician.honorificPrefix added
 * N14: Physician.alumniOf added from degrees
 * N23: actionPlatform uses https://schema.org/
 */

import { ids, DAY_URLS } from "./ids.js"

// ── 1. WebSite ─────────────────────────────────────────────────────────────
export function websiteSchema(config) {
  const ID = ids(config.site.url, config.site.blogPath)
  return {
    "@type": "WebSite",
    "@id":   ID.website,
    "name":  config.clinic.name,
    "url":   config.site.url,
    // N9: publisher links WebSite to Organization — Google knowledge panel benefit
    "publisher": { "@id": ID.clinic },
    "potentialAction": {
      "@type":       "SearchAction",
      "target":      `${config.site.url}${config.site.searchUrl}`,
      "query-input": "required name=search_term_string",
    },
  }
}

// ── 2. MedicalClinic ───────────────────────────────────────────────────────
export function clinicSchema(config) {
  const ID      = ids(config.site.url, config.site.blogPath)
  const { clinic } = config

  return {
    "@type":         ["MedicalClinic", "MedicalOrganization"],
    "@id":           ID.clinic,
    "name":          clinic.name,
    "alternateName": clinic.alternateName || clinic.tagline,
    "url":           config.site.url,

    // N10: logo @id for knowledge panel cross-reference
    "logo": {
      "@type":  "ImageObject",
      "@id":    ID.clinicLogo,
      "url":    clinic.logo || `${config.site.url}/logo.png`,
      "width":  clinic.logoWidth  || 600,
      "height": clinic.logoHeight || 60,
    },

    // N11: clinic image @id
    "image": {
      "@type":  "ImageObject",
      "@id":    ID.clinicImage,
      "url":    clinic.image,
      "width":  clinic.imageWidth  || 1200,
      "height": clinic.imageHeight || 800,
    },

    "description":        clinic.description || `${clinic.medicalSpecialty || clinic.specialty} in ${clinic.city}`,
    "email":              clinic.email,
    "telephone":          clinic.telephone,
    "foundingDate":       clinic.foundingDate,
    "priceRange":         clinic.priceRange,
    "medicalSpecialty":   `https://schema.org/${clinic.specialty}`,
    "currenciesAccepted": clinic.currenciesAccepted,
    "paymentAccepted":    clinic.paymentAccepted,
    "hasMap":             clinic.mapUrl,

    "address": {
      "@type":           "PostalAddress",
      "streetAddress":   (clinic.addressObj || clinic.address).street || clinic.street || '',
      "addressLocality": (clinic.addressObj || {}).city || clinic.city || '',
      "addressRegion":   (clinic.addressObj || {}).state || clinic.state || '',
      "postalCode":      (clinic.addressObj || {}).pincode || clinic.pincode || '',
      "addressCountry":  (clinic.addressObj || {}).country || 'IN',
    },

    "geo": {
      "@type":    "GeoCoordinates",
      "latitude":  clinic.geo.latitude || parseFloat(clinic.geo.lat) || 0,
      "longitude": clinic.geo.longitude || parseFloat(clinic.geo.lng) || 0,
    },

    "contactPoint": {
      "@type":       "ContactPoint",
      "telephone":   clinic.telephone,
      // N2: 'customer support' is Google's recommended value (not 'customer service')
      "contactType": "customer support",
      "availableLanguage": Array.isArray(clinic.languagesArr) && clinic.languagesArr.length ? clinic.languagesArr.map(l => l.name) : (typeof clinic.languages === 'string' ? clinic.languages.split(',').map(l => l.trim()).filter(Boolean) : Array.isArray(clinic.languages) ? clinic.languages.map(l => typeof l === 'string' ? l : l.name) : []),
      "areaServed":        clinic.address.country,
    },

    "openingHoursSpecification": clinic.hours.map(h => ({
      "@type":     "OpeningHoursSpecification",
      "dayOfWeek": h.days.map(d => DAY_URLS[d] || d),
      "opens":     h.opens,
      "closes":    h.closes,
    })),

    "aggregateRating": {
      "@type":       "AggregateRating",
      "ratingValue": (clinic.rating && clinic.rating.value) || parseFloat(clinic.ratingValue) || 5.0,
      "reviewCount": (clinic.rating && clinic.rating.count) || parseInt(clinic.reviewCount) || 0,
      "bestRating":  (clinic.rating && clinic.rating.best)  || 5,
      "worstRating": (clinic.rating && clinic.rating.worst) || 1,
    },

    // N12: Review nodes get @id
    "review": config.reviews.map((r, i) => ({
      "@type": "Review",
      "@id":   `${config.site.url}/#review-${i}`,
      "author": {
        "@type": "Person",
        "name":  r.author,
      },
      "reviewRating": {
        "@type":       "Rating",
        "ratingValue": r.rating,       // N22: Number in config
        "bestRating":  clinic.rating.best,
        "worstRating": clinic.rating.worst,
      },
      "reviewBody":    r.text,
      "datePublished": r.date,
      "itemReviewed":  { "@id": ID.clinic },
    })),

    "sameAs": Object.values(clinic.social),

    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type":          "EntryPoint",
        "urlTemplate":    clinic.bookingUrl || `${config.site.url}/appointment`,
        // N23: https:// instead of http://
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      "name": "Book Appointment",
    },

    "employee": { "@id": ID.doctor },
  }
}

// ── 3. Physician ───────────────────────────────────────────────────────────
export function physicianSchema(config) {
  const ID             = ids(config.site.url, config.site.blogPath)
  const { doctor, clinic } = config

  return {
    // Person added so all Person properties (honorificPrefix, jobTitle, gender,
    // worksFor, alumniOf, knowsLanguage) are valid — fixes all validator warnings.
    // Physician is a subtype of MedicalBusiness; adding Person makes it a
    // multi-typed node that satisfies the employee property expectation too.
    "@type": ["Physician", "Person"],
    "@id":   ID.doctor,
    "name":  doctor.name,
    // N13: honorificPrefix for E-E-A-T
    ...(doctor.honorificPrefix && { "honorificPrefix": doctor.honorificPrefix }),

    "image": {
      "@type":  "ImageObject",
      "@id":    ID.doctorImage,
      "url":    doctor.image,
      "width":  doctor.imageWidth,
      "height": doctor.imageHeight,
    },

    "url":         `${config.site.url}${doctor.profilePath || '/doctor'}`,
    "jobTitle":    doctor.jobTitle,
    "description": doctor.description,
    "gender":      doctor.gender ? `https://schema.org/${doctor.gender}` : undefined,
    "email":       doctor.email,
    "telephone":   clinic.telephone,

    "identifier": {
      "@type": "PropertyValue",
      "name":  "Medical Registration Number",
      "value": doctor.registrationNumber || doctor.nmcNumber,
    },

    "medicalSpecialty": `https://schema.org/${clinic.specialty}`,
    "worksFor":          { "@id": ID.clinic },

    "hasCredential": (doctor.degreesObj || []).map(d => ({
      "@type":            "EducationalOccupationalCredential",
      "name":             d.name,
      "educationalLevel": d.level,
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name":  d.institution,
      },
    })),

    // N14: alumniOf — E-E-A-T trust signal, distinct from hasCredential
    "alumniOf": (doctor.degreesObj || [])
      .filter((d, i, arr) => arr.findIndex(x => x.institution === d.institution) === i)
      .filter(d => d.institution)
      .map(d => ({
        "@type": "EducationalOrganization",
        "name":  d.institution,
      })),

    "memberOf": doctor.memberships.map(m => ({
      "@type": "MedicalOrganization",
      "name":  m,
    })),

    "award":      doctor.awards,
    "knowsAbout": doctor.knowsAbout || doctor.specialties || [],

    "knowsLanguage": (doctor.languagesObj || doctor.languages || []).map(l => ({
      "@type":         "Language",
      "name":          typeof l === 'string' ? l : l.name,
      "alternateName": typeof l === 'string' ? l.slice(0,2).toLowerCase() : (l.code || l.name.slice(0,2).toLowerCase()),
    })),

    "aggregateRating": {
      "@type":       "AggregateRating",
      "ratingValue": (clinic.rating && clinic.rating.value) || 5.0,
      "reviewCount": (clinic.rating && clinic.rating.count) || 0,
      "bestRating":  (clinic.rating && clinic.rating.best)  || 5,
      "worstRating": (clinic.rating && clinic.rating.worst) || 1,
    },

    "sameAs": [
      clinic.social.linkedin,
      clinic.social.practo,
    ].filter(Boolean),

    "availableService": config.services.map(s => ({
      "@id":  ID.service(s.slug),
      "name": s.name,
    })),
  }
}
