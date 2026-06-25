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
  return buildLegalMetadata(cfg, 'terms')
}

export default async function TermsPage() {
  const cfg = await loadConfig()
  const name = (cfg.clinic as any)?.name || 'this clinic'
  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <LegalPage
          badge="Legal"
          title="Terms & Conditions"
          updated="March 1, 2026"
          sections={[
            { title: 'Acceptance of Terms', content: 'By accessing and using this website, you accept and agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use this website.' },
            { title: 'Website Purpose', content: `This website is owned and operated by ${name}. It is intended to provide general information about ${name}'s services, facilities, doctors, and treatment options. The content on this website is for informational purposes only.` },
            { title: 'No Doctor-Patient Relationship', content: 'Using this website, submitting an appointment request, or communicating through any channel on this site does not establish a doctor-patient relationship. A doctor-patient relationship is only formed after a formal in-person consultation and mutual agreement.' },
            { title: 'Accuracy of Information', content: 'While we strive to keep the information on this website accurate and up to date, we make no warranties or representations about the completeness, reliability, or accuracy of any content. Treatment outcomes, pricing, and availability may vary and are subject to change without notice.' },
            { title: 'User Responsibilities', content: [
              'Provide accurate and truthful information when submitting forms',
              'Not misuse the website or attempt to interfere with its functionality',
              'Not reproduce, duplicate, or copy any content without prior written consent',
              'Use the website in compliance with all applicable laws and regulations',
            ]},
            { title: 'Appointment Requests', content: `Submitting an appointment request through this website does not guarantee an appointment. All requests are subject to confirmation by ${name}. ${name} reserves the right to accept or decline any appointment request.` },
            { title: 'Intellectual Property', content: `All content on this website including text, images, logos, graphics, and design is the property of ${name} and is protected by applicable intellectual property laws. Unauthorised use is strictly prohibited.` },
            { title: 'Third-Party Links', content: 'This website may contain links to third-party websites. These links are provided for convenience only. The Clinic does not endorse or take responsibility for the content or practices of any linked websites.' },
            { title: 'Limitation of Liability', content: `${name} shall not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or reliance on any information provided herein.` },
            { title: 'Changes to Terms', content: `${name} reserves the right to modify these terms at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the updated terms.` },
            { title: 'Governing Law', content: 'These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in India.' },
            { title: 'Contact', content: 'For any questions about these terms, please contact us at our clinic or via WhatsApp at the number listed on this page.' },
          ]}
        />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
