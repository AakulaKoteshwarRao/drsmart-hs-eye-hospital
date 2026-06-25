'use client'
import { useState } from 'react'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const reasons = ['Consultation', 'Follow-up', 'Second Opinion']
const times = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 5:00 PM']

export default function AppointmentForm({ clinic }: { clinic: ClinicInfo }) {
  const [form, setForm] = useState({ name: '', phone: '', age: '', reason: '', date: '', time: '', notes: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const sendWhatsApp = () => {
    const msg = [
      `*New Appointment Request*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Age: ${form.age}`,
      `Reason: ${form.reason}`,
      `Preferred Date: ${form.date}`,
      `Preferred Time: ${form.time}`,
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean).join('\n')
    const num = clinic.whatsapp.replace('+', '')
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section className="form-section">
      <div className="form-inner">
        <div className="form-layout">
          <div className="form-card">
            <h2>Request an Appointment</h2>
            <p>Fill in your details and we'll get back to you to confirm a convenient time.</p>
            <div className="form-row full">
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="user" size={16} className="input-icon" />
                  <input type="text" placeholder="Your Name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="form-row full">
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="phone" size={16} className="input-icon" />
                  <input type="tel" placeholder="Your Phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="form-row full">
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="clock" size={16} className="input-icon" />
                  <input type="number" placeholder="Your Age" value={form.age} onChange={e => set('age', e.target.value)} min="1" max="120" />
                </div>
              </div>
            </div>
            <div className="form-row full">
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="check-circle" size={16} className="input-icon" />
                  <select value={form.reason} onChange={e => set('reason', e.target.value)}>
                    <option value="" disabled>Appointment for</option>
                    {reasons.map((r, i) => <option key={i}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="calendar" size={16} className="input-icon" />
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrap">
                  <Icon name="clock" size={16} className="input-icon" />
                  <select value={form.time} onChange={e => set('time', e.target.value)}>
                    <option value="" disabled>Preferred Time</option>
                    {times.map((t, i) => <option key={i}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row full">
              <div className="form-group">
                <textarea placeholder="Your comment or concern (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
              </div>
            </div>
            <button className="form-submit-wa" onClick={sendWhatsApp}>
              <Icon name="whatsapp" size={20} /> Send via WhatsApp
            </button>
            <p className="form-note">Your details will be sent to us via WhatsApp for quick confirmation.</p>
          </div>
          <div className="form-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-card-icon" style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))' }}>
                <Icon name="whatsapp" size={20} color="#FFFFFF" />
              </div>
              <h3>Prefer WhatsApp?</h3>
              <p>Send us a message and we'll help you book an appointment instantly.</p>
              <a href={`https://wa.me/${clinic.whatsapp.replace('+', '')}`} style={{ color: 'var(--whatsapp)' }}>
                WhatsApp Us <Icon name="arrow-right" size={14} />
              </a>
            </div>
            <div className="sidebar-card">
              <div className="sidebar-card-icon" style={{ background: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))' }}>
                <Icon name="phone" size={20} color="#FFFFFF" />
              </div>
              <h3>Call Directly</h3>
              <p>Speak to our front desk to schedule your appointment right away.</p>
              <a href={`tel:${clinic.phone}`} style={{ color: 'var(--secondary)' }}>
                {clinic.phone} <Icon name="arrow-right" size={14} />
              </a>
            </div>
            <div className="sidebar-card">
              <div className="sidebar-card-icon" style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))' }}>
                <Icon name="clock" size={20} color="#FFFFFF" />
              </div>
              <h3>Working Hours</h3>
              <p>{clinic.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
