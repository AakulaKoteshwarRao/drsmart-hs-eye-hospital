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
  return buildLegalMetadata(cfg, 'disclaimer')
}

export default async function DisclaimerPage() {
  const cfg = await loadConfig()
  const name = (cfg.clinic as any)?.name || 'this clinic'
  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <LegalPage
          badge="Legal"
          title="Medical Disclaimer"
          updated="March 1, 2026"
          sections={[
            { title: 'Informational Purposes Only', content: 'The content on this website including text, images, videos, and other materials is provided for general informational and educational purposes only. It is not intended as, and should not be considered, a substitute for professional medical advice, diagnosis, or treatment.' },
            { title: 'Not Medical Advice', content: 'No content on this website should be interpreted as medical advice for any specific condition. The information provided is general in nature and may not apply to your individual circumstances. Always seek the advice of a qualified healthcare professional for any medical condition or treatment.' },
            { title: 'No Doctor-Patient Relationship', content: `Browsing this website, reading blog posts, watching videos, or submitting an appointment request does not create a doctor-patient relationship between you and any doctor associated with ${name}. Such a relationship is only established through a formal in-person consultation.` },
            { title: 'Treatment Outcomes', content: 'Patient testimonials, success stories, before/after images, and case studies featured on this website represent individual experiences and outcomes. Results vary from person to person depending on age, health condition, severity of the problem, and other factors. No guarantee of specific outcomes is made or implied.' },
            { title: 'Pricing & Cost Estimates', content: 'All pricing information, package costs, and treatment estimates displayed on this website are approximate ranges provided for reference only. Exact costs are determined during the first consultation based on the patient\'s specific condition and treatment plan. Prices may change without prior notice.' },
            { title: 'Emergency Situations', content: 'This website is not designed for medical emergencies. If you are experiencing a medical emergency, please call your local emergency number or visit the nearest hospital emergency department immediately.' },
            { title: 'Third-Party Content', content: 'This website may reference medical studies, research, or information from external sources. While we strive to reference credible sources, we do not guarantee the accuracy of third-party content and are not responsible for information provided on external websites.' },
            { title: 'Professional Judgement', content: `The doctors and healthcare professionals at ${name} exercise their professional judgement when recommending treatments. Treatment plans are personalised and based on thorough clinical evaluation. ${name} is not liable for decisions made by patients based solely on website content without a formal consultation.` },
            { title: 'Updates to Content', content: 'Medical knowledge evolves continuously. While we make efforts to keep content current, some information on this website may not reflect the most recent medical developments or guidelines. The date of last review is indicated where applicable.' },
            { title: 'Contact', content: 'If you have questions about the information on this website or wish to schedule a consultation, please contact us at our clinic or via WhatsApp.' },
          ]}
        />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
