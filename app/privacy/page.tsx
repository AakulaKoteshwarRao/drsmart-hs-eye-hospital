import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import Footer from '@/components/Footer'
import LegalPage from '@/components/legal/LegalPage'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { buildLegalMetadata } from '@/lib/seo'
import '@/app/styles/legal.css'

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await loadConfig()
  return buildLegalMetadata(cfg, 'privacy-policy')
}

export default async function PrivacyPage() {
  const cfg = await loadConfig()
  const name = (cfg.clinic as any)?.name || 'this clinic'
  const phone = (cfg.clinic as any)?.phone || 'the number listed on this page'
  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <LegalPage
          badge="Legal"
          title="Privacy Policy"
          updated="March 1, 2026"
          sections={[
            { title: 'Overview', content: `${name} is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information when you use our website or services.` },
            { title: 'Information We Collect', content: [
              'Personal information: Name, phone number, age, and reason for visit submitted through the appointment form',
              'Health information: Medical history, symptoms, and treatment details shared during consultations',
              'Usage data: Browser type, pages visited, time spent on site collected through cookies and analytics tools',
            ]},
            { title: 'How We Use Your Information', content: [
              'Schedule and confirm appointments',
              'Provide medical consultations and treatment',
              'Communicate with you about your care',
              'Improve our website and services',
              'Send appointment reminders (with your consent)',
            ]},
            { title: 'Data Protection', content: 'We take appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Patient health records are maintained in accordance with applicable medical record-keeping regulations.' },
            { title: 'Data Sharing', content: [
              'With healthcare professionals involved in your treatment',
              'With hospital administration for appointment coordination',
              'When required by law or legal proceedings',
              'With your explicit consent',
            ]},
            { title: 'Cookies', content: 'This website uses cookies to improve user experience and analyse website traffic. You can choose to disable cookies through your browser settings. Disabling cookies may affect certain features of the website.' },
            { title: 'Patient Data & Consent', content: `Patient testimonials, reviews, success stories, and before/after images are published only with explicit written consent from the patient. Patients may request removal of their content at any time by contacting ${name}.` },
            { title: 'Data Retention', content: 'We retain personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Medical records are retained in accordance with applicable healthcare regulations.' },
            { title: 'Your Rights', content: [
              'Request access to your personal information',
              'Request correction of inaccurate data',
              'Request deletion of your data (subject to legal obligations)',
              'Withdraw consent for communications at any time',
            ]},
            { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.' },
            { title: 'Contact', content: `For any privacy-related queries, please contact us at our clinic or via WhatsApp at ${phone}.` },
          ]}
        />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
