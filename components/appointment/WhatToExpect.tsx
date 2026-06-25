const steps = [
  { num: '1', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Confirmation Call', body: 'Our team will reach out to you promptly to confirm a convenient date and time for your visit.' },
  { num: '2', grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', title: 'Prepare Your Records', body: 'Bring any previous medical reports, test results, prescriptions, and a list of current medications to your appointment.' },
  { num: '3', grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', title: 'Thorough Consultation', body: 'The doctor will review your history, examine you thoroughly, and explain all available treatment options clearly.' },
  { num: '4', grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', title: 'Clear Next Steps', body: 'You\'ll leave with a clear diagnosis, a written treatment plan, and a timeline for your care.' },
]

export default function WhatToExpect() {
  return (
    <section className="expect-section">
      <div className="sec-header" style={{ textAlign: 'center' }}>
        <div className="sec-label" style={{ justifyContent: 'center' }}><span>After Booking</span></div>
        <h2 className="sec-title">What to expect.</h2>
        <p className="sec-sub" style={{ margin: '0 auto' }}>Here's what happens after you submit your appointment request.</p>
      </div>
      <div className="expect-grid">
        {steps.map((s, i) => (
          <div key={i} className="expect-card" style={{ padding: '1.5rem' }}>
            <div className="expect-num" style={{ background: s.grad }}>{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
