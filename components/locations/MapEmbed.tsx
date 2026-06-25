import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function MapEmbed({ clinic }: { clinic: ClinicInfo }) {
  return (
    <section className="map-section">
      <div className="map-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Map</span></div>
          <h2 className="sec-title">Find us on the map.</h2>
        </div>
        <div className="map-embed">
          {clinic.mapEmbedUrl ? (
            <iframe src={clinic.mapEmbedUrl} width="100%" height="400" style={{ border: 0, borderRadius: '12px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <>
              <Icon name="location" size={48} color="var(--primary)" />
              <span>Map -- add <code>mapEmbedUrl</code> to config</span>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
