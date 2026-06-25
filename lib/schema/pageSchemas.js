/**
 * PAGE SCHEMAS — WebPage + BreadcrumbList + FAQPage
 *
 * N_DS: Breadcrumb @id uses ID.breadcrumb(path) from ids.js — no double-slash on homepage
 * N15:  WebPage.publisher added → MedicalClinic
 * N3:   BreadcrumbList item @id uses ID.webpage(crumb.path) for proper graph linking
 *       Crumbs now accept { name, url, path? } — path is optional, defaults to url
 * N16:  FAQPage.about added — links to page subject
 */

import { ids } from "./ids.js"

// ── 4. WebPage ─────────────────────────────────────────────────────────────
export function webpageSchema(config, { path, name, description, aboutId, image, datePublished, dateModified, hasFaq = false }) {
  const ID = ids(config.site.url, config.site.blogPath)
  return {
    "@type":       "WebPage",
    "@id":         ID.webpage(path),
    "url":         `${config.site.url}${path}`,
    "name":        name,
    "description": description,
    "inLanguage":  "en",
    "isPartOf":    { "@id": ID.website },
    "about":       { "@id": aboutId },
    // N_DS: ID.breadcrumb(path) normalizes homepage double-slash
    "breadcrumb":  { "@id": ID.breadcrumb(path) },
    "author":      { "@id": ID.doctor },
    // N15: publisher for E-E-A-T
    "publisher":   { "@id": ID.clinic },
    ...(hasFaq && { "hasPart": { "@id": ID.faq(path) } }),
    ...(image && {
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url":   image,
      },
    }),
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified  && { "dateModified":  dateModified  }),
    "speakable": {
      "@type":       "SpeakableSpecification",
      "cssSelector": [".faq-answer", ".page-summary"],
    },
  }
}

// ── 5. BreadcrumbList ──────────────────────────────────────────────────────
// Crumbs: { name, url, path? }
// - url: the display/canonical URL for the breadcrumb link
// - path: optional — the path portion used to build the WebPage @id (e.g. "/" or "/services/x")
//         if omitted, path is inferred from url by stripping siteUrl prefix
export function breadcrumbSchema(config, { path, crumbs }) {
  const ID   = ids(config.site.url, config.site.blogPath)
  const base = config.site.url

  return {
    "@type": "BreadcrumbList",
    // N_DS: uses ID.breadcrumb(path) to avoid double-slash on homepage
    "@id":   ID.breadcrumb(path),
    "itemListElement": crumbs.map((crumb, index) => {
      // N3: item @id should point to the WebPage node @id, not just the URL
      // Derive page path: crumb.path if provided, else strip base from crumb.url
      const crumbPath = crumb.path !== undefined
        ? crumb.path
        : crumb.url.replace(base, "") || "/"
      return {
        "@type":    "ListItem",
        "position": index + 1,
        "name":     crumb.name,
        "item": {
          "@type": "WebPage",
          "@id":   ID.webpage(crumbPath),
        },
      }
    }),
  }
}

// ── 6. FAQPage ─────────────────────────────────────────────────────────────
// N16: aboutId parameter added so FAQPage can link to its subject
export function faqSchema(config, path, faqItems, aboutId = null) {
  const ID   = ids(config.site.url, config.site.blogPath)
  const base = config.site.url
  return {
    "@type": "FAQPage",
    "@id":   ID.faq(path),
    // N16: link FAQPage to its subject entity
    ...(aboutId && { "about": { "@id": aboutId } }),
    "mainEntity": faqItems.map((item, index) => ({
      "@type": "Question",
      "@id":   `${base}${path === "/" ? "" : path}/#faq-${index}`,
      "name":  item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  item.a,
      },
    })),
  }
}
