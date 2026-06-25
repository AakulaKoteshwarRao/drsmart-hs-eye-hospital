import type { StepItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

const stepIconClass = ['sf-1', 'sf-2', 'sf-3', 'sf-4']

export default function HowWeWork({ steps }: { steps: StepItem[] }) {
  return (
    <section className="process-section section-cool-grey">
      <div className="process-inner">
        <div className="sec-header">
          <div className="sec-label"><span>How We Work</span></div>
          <h2 className="sec-title">Four steps that put you in control.</h2>
          <p className="sec-sub">No surprises. No unexplained decisions. You know what&apos;s happening and why -- at every stage.</p>
        </div>
        <div className="steps-flow">
          {steps.map((step, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <div className={`sf-card ${stepIconClass[i]}`}>
                <div className="sf-top">
                  <span className="sf-badge">{step.badge}</span>
                  <div className="sf-icon">
                    <Icon name={step.iconType || 'file'} size={22} color="#FFFFFF" />
                  </div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <>
                  <div className="sf-arrow-h"><Icon name="chevron-right" size={22} /></div>
                  <div className="sf-arrow-v"><Icon name="chevron-down" size={22} /></div>
                </>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
