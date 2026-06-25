/**
 * ID FACTORY — lib/schema/ids.js
 *
 * N_DS: joinUrl helper prevents double-slash when path = "/" (homepage breadcrumb bug)
 *       e.g. "https://site.com" + "/" + "/#breadcrumb" → "https://site.com//#breadcrumb" (wrong)
 *            joinUrl("https://site.com", "/", "/#breadcrumb") → "https://site.com/#breadcrumb" (correct)
 */

export const DAY_URLS = {
  Monday:    "https://schema.org/Monday",
  Tuesday:   "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday:  "https://schema.org/Thursday",
  Friday:    "https://schema.org/Friday",
  Saturday:  "https://schema.org/Saturday",
  Sunday:    "https://schema.org/Sunday",
}

/**
 * Safely join siteUrl + path + suffix without double slashes.
 * joinUrl("https://site.com", "/", "/#breadcrumb") → "https://site.com/#breadcrumb"
 * joinUrl("https://site.com", "/services/x", "/#breadcrumb") → "https://site.com/services/x/#breadcrumb"
 */
export function joinUrl(base, path, suffix = "") {
  const cleanBase = base.replace(/\/$/, "")
  const cleanPath = path === "/" ? "" : path
  return `${cleanBase}${cleanPath}${suffix}`
}

export function ids(siteUrl, blogPath = "/blog") {
  const base = siteUrl.replace(/\/$/, "")
  return {
    website:   `${base}/#website`,
    clinic:    `${base}/#clinic`,
    doctor:    `${base}/#doctor`,
    clinicLogo:   `${base}/#clinic-logo`,
    clinicImage:  `${base}/#clinic-image`,
    doctorImage:  `${base}/#doctor-image`,
    service:   (slug) => `${base}/services/${slug}/#service`,
    procedure: (slug) => `${base}/procedures/${slug}/#procedure`,
    condition: (slug) => `${base}/conditions/${slug}/#condition`,
    article:   (slug) => `${base}${blogPath}/${slug}/#article`,
    webpage:   (path) => joinUrl(base, path, "/#webpage"),
    location:  (slug) => `${base}/locations/${slug}/#localbusiness`,
    video:     (slug) => `${base}/videos/${slug}/#video`,
    howto:     (slug) => `${base}/guides/${slug}/#howto`,
    faq:       (path) => joinUrl(base, path, "/#faqpage"),
    breadcrumb:(path) => joinUrl(base, path, "/#breadcrumb"),   // N_DS: centralized to avoid double-slash
    review:    (i)    => `${base}/#review-${i}`,
  }
}
