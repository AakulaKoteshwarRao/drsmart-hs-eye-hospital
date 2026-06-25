/**
 * CONTENT SCHEMAS
 *
 * N1:  procedureType mapped to https://schema.org/{type} (valid enum URL)
 * N4:  LocalBusiness @type → ['LocalBusiness', 'MedicalClinic']
 * N5:  VideoObject @id uses ID.video(slug) not contentUrl (in-domain @id)
 * N6:  HowTo.image wrapped as ImageObject
 * N7:  HowTo.url added
 * N8:  geo lat/long as Numbers in config (handled at config level)
 * N17: Offer.seller added
 * N18: possibleTreatment matched procedures include @type: 'MedicalProcedure'
 * N19: Article @type now configurable (defaults to 'BlogPosting' for medical blogs)
 * N20: LocalBusiness adds branchOf alongside parentOrganization
 * N21: HowToStep nodes get @id
 */

import { ids, DAY_URLS } from "./ids.js"

// ── 7. MedicalService ──────────────────────────────────────────────────────
export function serviceSchema(config, service) {
  const ID      = ids(config.site.url, config.site.blogPath)
  const pageUrl = `${config.site.url}/services/${service.slug}`
  return {
    "@type":          "MedicalService",
    "@id":            ID.service(service.slug),
    "url":            pageUrl,
    "name":           service.name,
    "description":    service.description,
    "medicalSpecialty": `https://schema.org/${config.clinic.specialty}`,
    "serviceType":    config.clinic.serviceType,
    "provider":       { "@id": ID.doctor },
    "availableChannel": {
      "@type":           "ServiceChannel",
      "serviceLocation": { "@id": ID.clinic },
      "serviceUrl":      config.clinic.bookingUrl,
    },
    "areaServed": service.areas.map(area => ({
      "@type": "City",
      "name":  area,
    })),
    "offers": {
      "@type":         "Offer",
      "url":           pageUrl,
      "price":         service.offer.price,
      "priceCurrency": config.clinic.currenciesAccepted,
      "description":   service.offer.description,
      "availability":  "https://schema.org/InStock",
      // N17: seller links Offer to the clinic organization
      "seller":        { "@id": ID.clinic },
    },
    "serviceOutput": service.output,
  }
}

// ── 8. MedicalProcedure ────────────────────────────────────────────────────
export function procedureSchema(config, procedure) {
  const ID = ids(config.site.url, config.site.blogPath)
  return {
    "@type":         "MedicalProcedure",
    "@id":           ID.procedure(procedure.slug),
    "url":           `${config.site.url}/procedures/${procedure.slug}`,
    "name":          procedure.name,
    "alternateName": procedure.alternateName,
    "description":   procedure.description,
    // N1: procedureType as schema.org URL — config.procedure.type must be a valid MedicalProcedureType enum name
    // Valid: NoninvasiveProcedure | PercutaneousProcedure | SurgicalProcedure
    "procedureType": `https://schema.org/${procedure.type}`,
    "bodyLocation": {
      "@type": "AnatomicalStructure",
      "name":  procedure.bodyLocation,
    },
    "preparation":               procedure.preparation,
    "followup":                  procedure.followup,
    "howPerformed":              procedure.howPerformed,
    "expectedPrognosis":         procedure.prognosis,
    "procedureContraindication": procedure.contraindications,
    "cost": {
      "@type":    "MonetaryAmount",
      "currency": config.clinic.currenciesAccepted || 'INR',
      "value":    procedure.cost ? procedure.cost.price : (procedure.minCost || procedure.maxCost || ''),
      "minValue": procedure.cost ? procedure.cost.minPrice : (procedure.minCost || ''),
      "maxValue": procedure.cost ? procedure.cost.maxPrice : (procedure.maxCost || ''),
    },
    "performer": { "@id": ID.doctor },
  }
}

// ── 9. MedicalCondition ────────────────────────────────────────────────────
export function conditionSchema(config, condition) {
  const ID = ids(config.site.url, config.site.blogPath)
  return {
    "@type":         "MedicalCondition",
    "@id":           ID.condition(condition.slug),
    "url":           `${config.site.url}/conditions/${condition.slug}`,
    "name":          condition.name,
    "alternateName": condition.alternateName || condition.name,
    "description":   condition.description,
    "code": {
      "@type":        "MedicalCode",
      "code":         condition.icdCode,
      "codingSystem": "ICD-10",
    },
    "associatedAnatomy": {
      "@type": "AnatomicalStructure",
      "name":  condition.anatomy,
    },
    "signOrSymptom": condition.symptoms.map(s => ({
      "@type": "MedicalSymptom",
      "name":  s,
    })),
    "riskFactor": condition.risks.map(r => ({
      "@type": "MedicalRiskFactor",
      "name":  r,
    })),
    "possibleComplication": condition.complications,
    "epidemiology":         condition.epidemiology,
    "expectedPrognosis":    condition.prognosis,
    "possibleTreatment": condition.treatments.map(t => {
      const matched = config.procedures.find(p => p.name === t)
      // N18: include @type so reference is self-describing even without @graph resolution
      if (matched) return { "@type": "MedicalProcedure", "@id": ID.procedure(matched.slug), "name": t }
      return { "@type": "MedicalTherapy", "name": t }
    }),
  }
}

// ── 10. Article ─────────────────────────────────────────────────────────────
export function articleSchema(config, article) {
  const ID          = ids(config.site.url, config.site.blogPath)
  const articlePath = article.path || `${config.site.blogPath}/${article.slug}`

  const aboutRef = article.aboutConditionSlug
    ? { "@id": ID.condition(article.aboutConditionSlug) }
    : article.aboutServiceSlug
    ? { "@id": ID.service(article.aboutServiceSlug) }
    : undefined

  return {
    // N19: BlogPosting is more specific than Article for medical blogs
    // Override by passing article.schemaType in pageData if needed
    "@type":    article.schemaType || "BlogPosting",
    "@id":      ID.article(article.slug),
    "headline": article.title,
    "mainEntityOfPage": { "@id": ID.webpage(articlePath) },
    "isPartOf":  { "@id": `${config.site.url}/#website` },
    "description":    article.excerpt,
    "image": {
      "@type":  "ImageObject",
      "url":    article.image,
      "width":  article.imageWidth  || 1200,
      "height": article.imageHeight || 630,
    },
    "author":         { "@id": ID.doctor },
    "publisher":      { "@id": ID.clinic },
    "datePublished":  article.datePublished,
    "dateModified":   article.dateModified,
    "articleBody":    article.body,
    "keywords":       article.keywords,
    "articleSection": article.category,
    "inLanguage":     "en",
    "wordCount":      article.wordCount,
    "speakable": {
      "@type":       "SpeakableSpecification",
      "cssSelector": [".article-summary", ".faq-answer"],
    },
    ...(aboutRef && { "about": aboutRef }),
  }
}

// ── 11. LocalBusiness ──────────────────────────────────────────────────────
export function localBusinessSchema(config, location) {
  const ID      = ids(config.site.url, config.site.blogPath)
  const { clinic } = config
  return {
    // N4: more specific @type for medical clinic branches
    "@type": ["LocalBusiness", "MedicalClinic"],
    "@id":   ID.location(location.slug),
    "name":  location.name,
    "url":   location.url,
    "image": {
      "@type":  "ImageObject",
      "url":    clinic.image,
      "width":  clinic.imageWidth  || 1200,
      "height": clinic.imageHeight || 800,
    },
    "email":     clinic.email,
    "telephone": clinic.telephone,
    "priceRange": clinic.priceRange,
    "medicalSpecialty": `https://schema.org/${clinic.specialty}`,
    "sameAs": Object.values(clinic.social),
    "address": {
      "@type":           "PostalAddress",
      "streetAddress":   (clinic.addressObj || {}).street || clinic.street || '',
      "addressLocality": location.area || (clinic.addressObj || {}).city || clinic.city || '',
      "addressRegion":   (clinic.addressObj || {}).state || clinic.state || '',
      "postalCode":      (clinic.addressObj || {}).pincode || clinic.pincode || '',
      "addressCountry":  (clinic.addressObj || {}).country || 'IN',
    },
    "geo": {
      "@type":    "GeoCoordinates",
      "latitude":  clinic.geo.latitude || parseFloat(clinic.geo.lat) || 0,
      "longitude": clinic.geo.longitude || parseFloat(clinic.geo.lng) || 0,
    },
    "areaServed": location.areasServed.map(area => ({
      "@type": "City",
      "name":  area,
    })),
    "openingHoursSpecification": clinic.hours.map(h => ({
      "@type":     "OpeningHoursSpecification",
      "dayOfWeek": h.days.map(d => DAY_URLS[d] || d),
      "opens":     h.opens,
      "closes":    h.closes,
    })),
    // N20: branchOf is more precise than parentOrganization for satellite clinic locations
    "branchOf":           { "@id": ID.clinic },
    "parentOrganization": { "@id": ID.clinic },
    "aggregateRating": {
      "@type":       "AggregateRating",
      "ratingValue": (clinic.rating && clinic.rating.value) || 5.0,
      "reviewCount": (clinic.rating && clinic.rating.count) || 0,
      "bestRating":  (clinic.rating && clinic.rating.best)  || 5,
      "worstRating": (clinic.rating && clinic.rating.worst) || 1,
    },
  }
}

// ── 12. VideoObject ────────────────────────────────────────────────────────
export function videoSchema(config, video) {
  const ID = ids(config.site.url, config.site.blogPath)
  const aboutRef = video.aboutConditionSlug
    ? { "@id": ID.condition(video.aboutConditionSlug) }
    : video.aboutServiceSlug
    ? { "@id": ID.service(video.aboutServiceSlug) }
    : undefined
  return {
    "@type":        "VideoObject",
    // N5: @id is in-domain URL, not YouTube contentUrl
    "@id":          ID.video(video.slug),
    "url":          video.pageUrl,
    "name":         video.title,
    "description":  video.description,
    "thumbnailUrl": video.thumbnail,
    "uploadDate":   video.uploadDate,
    "duration":     video.duration,
    "contentUrl":   video.contentUrl,
    "embedUrl":     video.embedUrl,
    "inLanguage":   "en",
    "author":       { "@id": ID.doctor },
    "publisher":    { "@id": ID.clinic },
    ...(aboutRef && { "about": aboutRef }),
  }
}

// ── 13. HowTo ─────────────────────────────────────────────────────────────
export function howtoSchema(config, guide) {
  const ID      = ids(config.site.url, config.site.blogPath)
  const howtoId = ID.howto(guide.slug)
  return {
    "@type":       "HowTo",
    "@id":         howtoId,
    // N7: url pointing to the actual guide page
    "url":         `${config.site.url}/guides/${guide.slug}`,
    "name":        guide.title,
    "description": guide.description,
    // N6: image as ImageObject with dimensions
    "image": {
      "@type":  "ImageObject",
      "url":    guide.image,
      "width":  guide.imageWidth  || 1200,
      "height": guide.imageHeight || 630,
    },
    "totalTime":   guide.totalTime,
    "estimatedCost": {
      "@type":    "MonetaryAmount",
      "currency": config.clinic.currenciesAccepted,
      "value":    guide.estimatedCost,
    },
    "supply": guide.supplies.map(s => ({ "@type": "HowToSupply", "name": s })),
    "tool":   guide.tools.map(t => ({ "@type": "HowToTool",   "name": t })),
    // N21: HowToStep nodes get @id
    "step": guide.steps.map((step, i) => ({
      "@type":    "HowToStep",
      "@id":      `${howtoId}/step-${i + 1}`,
      "position": i + 1,
      "name":     step.name,
      "text":     step.text,
      ...(step.image && { "image": step.image }),
    })),
    "author": { "@id": ID.doctor },
  }
}
