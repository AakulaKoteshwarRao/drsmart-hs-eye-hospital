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

  // Only emit `cost` when the client actually provided a figure — otherwise
  // omit it entirely rather than shipping an empty MonetaryAmount.
  const costValue = procedure.cost ? procedure.cost.price    : (procedure.minCost || procedure.maxCost || '')
  const costMin   = procedure.cost ? procedure.cost.minPrice : (procedure.minCost || '')
  const costMax   = procedure.cost ? procedure.cost.maxPrice : (procedure.maxCost || '')
  const cost = (costValue || costMin || costMax) ? {
    "@type":    "MonetaryAmount",
    "currency": config.clinic.currenciesAccepted || 'INR',
    ...(costValue && { "value":    costValue }),
    ...(costMin   && { "minValue": costMin }),
    ...(costMax   && { "maxValue": costMax }),
  } : null

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
    ...(cost && { "cost": cost }),
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
    ...(condition.diagnosisMethod && {
      "typicalTest": {
        "@type": "MedicalTest",
        "name":  condition.diagnosisMethod,
      },
    }),
    "possibleTreatment": condition.treatments.map(t => {
      const matched = config.procedures.find(p => p.name === t)
      // N18: include @type so reference is self-describing even without @graph resolution
      if (matched) return { "@type": "MedicalProcedure", "@id": ID.procedure(matched.slug), "name": t }
      return { "@type": "MedicalTherapy", "name": t }
    }),
  }
}

// ── 9b. Package (Product + Offer/AggregateOffer) ────────────────────────────
// Price can come from priceRange, price, or pricingTotal.value (the "Total
// Package Range" rollup shown when the client fills in a cost-breakdown table
// instead of a single price/priceRange field). Values may be plain digits
// ("24998"), a plain-digit range ("15000-25000"), or Indian lakh/crore
// shorthand ("₹2.5L – ₹4.5L", "₹1.2Cr") — parsePriceValue/parsePriceField
// normalize all of these into numeric values for schema.org.
function parsePriceValue(str) {
  const m = String(str).trim().match(/^([\d,]+(?:\.\d+)?)\s*(cr|crore|l|lac|lakh)?$/i)
  if (!m) return null
  const num = parseFloat(m[1].replace(/,/g, ""))
  if (isNaN(num)) return null
  const unit = (m[2] || "").toLowerCase()
  const multiplier = unit === "cr" || unit === "crore" ? 1e7
                    : unit === "l" || unit === "lac" || unit === "lakh" ? 1e5
                    : 1
  return Math.round(num * multiplier)
}

function parsePriceField(field) {
  if (!field) return null
  const parts = String(field)
    .replace(/₹/g, "")
    .replace(/[–—]/g, "-")
    .split(/\s*-\s*/)
    .map(p => p.trim())
    .filter(Boolean)

  if (parts.length === 2) {
    const low  = parsePriceValue(parts[0])
    const high = parsePriceValue(parts[1])
    if (low != null && high != null) return { low, high }
  }
  if (parts.length === 1) {
    const val = parsePriceValue(parts[0])
    if (val != null) return { value: val }
  }
  return null
}

export function packageSchema(config, pkg) {
  const ID      = ids(config.site.url, config.site.blogPath)
  const pageUrl = `${config.site.url}/packages/${pkg.slug}`
  const currency = config.clinic.currenciesAccepted || "INR"

  const priceSource = pkg.priceRange || pkg.price || pkg.pricingTotal?.value || ""
  const parsed = parsePriceField(priceSource)

  let offers
  if (parsed?.low != null) {
    offers = {
      "@type":         "AggregateOffer",
      "lowPrice":      String(parsed.low),
      "highPrice":     String(parsed.high),
      "priceCurrency": currency,
      "availability":  "https://schema.org/InStock",
      "url":           pageUrl,
      "seller":        { "@id": ID.clinic },
    }
  } else if (parsed?.value != null) {
    offers = {
      "@type":         "Offer",
      "price":         String(parsed.value),
      "priceCurrency": currency,
      "availability":  "https://schema.org/InStock",
      "url":           pageUrl,
      "seller":        { "@id": ID.clinic },
    }
  }

  const name = pkg.title || pkg.name || "Package"

  return {
    "@type":       "Product",
    "@id":         ID.package(pkg.slug),
    "url":         pageUrl,
    "name":        name,
    "description": pkg.description || `${name} available at ${config.clinic.name} in ${config.clinic.address?.city || ""}.`,
    "brand":       { "@id": ID.clinic },
    ...(offers && { "offers": offers }),
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
      "@type":   "ImageObject",
      "url":     article.image,
      "caption": article.title,
      "width":   article.imageWidth  || 1200,
      "height":  article.imageHeight || 630,
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
      "@type":   "ImageObject",
      "url":     clinic.image,
      "caption": location.name ? `${clinic.name} — serving ${location.name}` : clinic.name,
      "width":   clinic.imageWidth  || 1200,
      "height":  clinic.imageHeight || 800,
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

// ── 12b. VideoObjects from raw Supabase video records ───────────────────────
// Builds one VideoObject per published patient-story video. Raw records only
// carry youtube_url/title/caption/created_at, so thumbnail/embed/content URLs
// are derived from the extracted YouTube ID. @id and slug use the stable
// YouTube ID; uploadDate uses created_at (the real date the video was added —
// the true YouTube publish date isn't stored). All videos are embedded on the
// page passed as pageUrl. Records without a parseable YouTube ID are skipped,
// so template-fallback stories (which carry no youtube_url) never emit schema.
function youtubeId(url) {
  const m = String(url || "").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ""
}

export function videoSchemasFromRaw(config, rawVideos = [], pageUrl = "") {
  const ID = ids(config.site.url, config.site.blogPath)
  return (rawVideos || [])
    .map(v => {
      const vid = youtubeId(v.youtube_url)
      if (!vid) return null
      const title = v.title || "Patient story"
      return {
        "@type":        "VideoObject",
        "@id":          ID.video(vid),
        "url":          pageUrl,
        "name":         title,
        "description":  v.caption || title,
        "thumbnailUrl": `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
        ...(v.created_at && { "uploadDate": v.created_at }),
        "contentUrl":   `https://www.youtube.com/watch?v=${vid}`,
        "embedUrl":     `https://www.youtube.com/embed/${vid}`,
        "inLanguage":   "en",
        "author":       { "@id": ID.doctor },
        "publisher":    { "@id": ID.clinic },
      }
    })
    .filter(Boolean)
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
      "@type":   "ImageObject",
      "url":     guide.image,
      "caption": guide.title,
      "width":   guide.imageWidth  || 1200,
      "height":  guide.imageHeight || 630,
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
