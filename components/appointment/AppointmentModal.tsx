'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@/lib/icons'

const reasons = ['Consultation', 'Follow-up', 'Second Opinion']
const times = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 5:00 PM']

export default function AppointmentModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', age: '', reason: '', date: '', time: '', notes: '' })

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('openAppointmentModal', handler)
    return () => window.removeEventListener('openAppointmentModal', handler)
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const sendWhatsApp = () => {
    const msg = [
      `*New Appointment Request*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.age ? `Age: ${form.age}` : '',
      `Reason: ${form.reason}`,
      form.date ? `Preferred Date: ${form.date}` : '',
      form.time ? `Preferred Time: ${form.time}` : '',
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean).join('\n')
    const w = (window as any).__CLINIC__?.whatsapp || ''
    const num = w.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setOpen(false)}>
      <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--neutral-100)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-body)' }} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Booking</span>
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Book an Appointment</h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-faint)', marginTop: '0.35rem' }}>Fill in your details and send via WhatsApp instantly.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input type="text" placeholder="Your Name *" value={form.name} onChange={e => set('name', e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', boxSizing: 'border-box' }} />
          <input type="tel" placeholder="Your Phone *" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Your Age" value={form.age} onChange={e => set('age', e.target.value)} min="1" max="120" style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', boxSizing: 'border-box' }} />
          <select value={form.reason} onChange={e => set('reason', e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }}>
            <option value="" disabled>Appointment for *</option>
            {reasons.map((r, i) => <option key={i}>{r}</option>)}
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', boxSizing: 'border-box' }} />
            <select value={form.time} onChange={e => set('time', e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }}>
              <option value="" disabled>Preferred Time</option>
              {times.map((t, i) => <option key={i}>{t}</option>)}
            </select>
          </div>
          <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--neutral-200)', borderRadius: '10px', fontSize: 'var(--text-base)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={sendWhatsApp} style={{ width: '100%', marginTop: '1.25rem', padding: '0.9rem', background: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: 'var(--text-md)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Icon name="whatsapp" size={20} color="#FFFFFF" /> Send via WhatsApp
        </button>
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginTop: '0.75rem' }}>Your details will be sent to us via WhatsApp for quick confirmation.</p>
      </div>
    </div>
  )
}
