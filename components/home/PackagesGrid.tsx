import type { PackageItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function PackagesGrid({ packages, showViewAll = true }: { packages: PackageItem[]; showViewAll?: boolean }) {
  return (
    <section className="card-section section-cool-grey">
      <div className="sec-header">
        <div className="sec-label"><span>Packages</span></div>
        <h2 className="sec-title">Treatment packages.</h2>
        <p className="sec-sub">Transparent, all-inclusive packages designed to give patients clarity on costs from the start.</p>
      </div>
      <div className="card-grid">
        {packages.map((pkg, i) => (
          <a key={i} href={pkg.href} className="pkg-card">
            <div className={`pkg-icon ${pkg.gradClass}`}>
              <Icon name={pkg.iconType || 'briefcase'} size={24} color="#FFFFFF" />
            </div>
            <h3>{pkg.title}</h3>
            <p>{pkg.description}</p>
            <div className="pkg-price">{pkg.price}</div>
            <div className="pkg-tags">
              {pkg.tags.map((tag, j) => (
                <span key={j} className="pkg-tag">{tag}</span>
              ))}
            </div>
            <span className="learn-more">More Info <Icon name="arrow-right" size={16} /></span>
          </a>
        ))}
      </div>
      {showViewAll && (
        <div className="sec-cta">
          <a href="/products">View All Packages <Icon name="arrow-right" size={16} /></a>
        </div>
      )}
    </section>
  )
}
