/**
 * MASTER SCHEMA LOADER
 *
 * N16: faqSchema now receives aboutId so FAQPage can link to its subject
 * N5:  videoSchema now requires video.slug for in-domain @id
 */

import { websiteSchema, clinicSchema, physicianSchema } from "./coreSchemas.js"
import { webpageSchema, breadcrumbSchema, faqSchema }   from "./pageSchemas.js"
import {
  serviceSchema, procedureSchema, conditionSchema,
  articleSchema, localBusinessSchema, videoSchema, howtoSchema,
} from "./contentSchemas.js"
import { ids } from "./ids.js"

// ── CORE — call once in layout.tsx ────────────────────────────────────────
export function generateCoreSchemas(config) {
  return [
    websiteSchema(config),
    clinicSchema(config),
    physicianSchema(config),
  ]
}

// ── PAGE — call once in each page.tsx ────────────────────────────────────
export function generatePageSchemas(config, { pageType, pageData, meta, video } = {}) {
  const ID    = ids(config.site.url, config.site.blogPath)
  const nodes = []
  const path  = meta.path

  // Pre-compute whether this page has FAQ — needed for WebPage.hasPart link
  const hasFaq = !!(
    (pageType === "home"      && config.clinic.faq?.length) ||
    (pageType === "doctor"    && pageData?.faq?.length) ||
    (pageType === "service"   && pageData?.faq?.length) ||
    (pageType === "procedure" && pageData?.faq?.length) ||
    (pageType === "condition" && pageData?.faq?.length) ||
    (pageType === "blog"      && pageData?.faq?.length) ||
    (pageType === "location"  && pageData?.faq?.length) ||
    (pageType === "guide"     && pageData?.faq?.length)
  )

  // WebPage
  const aboutId = resolveAboutId(ID, pageType, pageData)
  nodes.push(webpageSchema(config, {
    path,
    name:          meta.name,
    description:   meta.description,
    aboutId,
    image:         meta.image,
    datePublished: meta.datePublished,
    dateModified:  meta.dateModified,
    hasFaq,
  }))

  // BreadcrumbList
  nodes.push(breadcrumbSchema(config, { path, crumbs: meta.breadcrumb }))

  // Page-type specific
  switch (pageType) {

    case "home":
      if (config.clinic.faq?.length)
        nodes.push(faqSchema(config, path, config.clinic.faq, ID.clinic))  // N16
      break

    case "doctor":
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.doctor))  // N16
      break

    case "service":
      nodes.push(serviceSchema(config, pageData))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.service(pageData.slug)))  // N16
      break

    case "procedure":
      nodes.push(procedureSchema(config, pageData))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.procedure(pageData.slug)))  // N16
      break

    case "condition":
      nodes.push(conditionSchema(config, pageData))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.condition(pageData.slug)))  // N16
      break

    case "blog":
      nodes.push(articleSchema(config, { ...pageData, path }))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.article(pageData.slug)))  // N16
      break

    case "location":
      nodes.push(localBusinessSchema(config, pageData))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.location(pageData.slug)))  // N16
      break

    case "guide":
      nodes.push(howtoSchema(config, pageData))
      if (pageData?.faq?.length)
        nodes.push(faqSchema(config, path, pageData.faq, ID.howto(pageData.slug)))  // N16
      break

    default:
      break
  }

  // N5: video.slug required for in-domain @id
  if (video) nodes.push(videoSchema(config, video))

  return nodes
}

// ── Helper ────────────────────────────────────────────────────────────────
function resolveAboutId(ID, pageType, pageData) {
  switch (pageType) {
    case "home":      return ID.clinic
    case "doctor":    return ID.doctor
    case "service":   return pageData?.slug ? ID.service(pageData.slug)   : ID.clinic
    case "procedure": return pageData?.slug ? ID.procedure(pageData.slug) : ID.clinic
    case "condition": return pageData?.slug ? ID.condition(pageData.slug) : ID.clinic
    case "blog":      return pageData?.slug ? ID.article(pageData.slug)   : ID.clinic
    case "location":  return pageData?.slug ? ID.location(pageData.slug)  : ID.clinic
    case "guide":     return pageData?.slug ? ID.howto(pageData.slug)     : ID.clinic
    default:          return ID.clinic
  }
}
