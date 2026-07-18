import { redirect } from 'next/navigation'

export default function LocationRedirect({ params }: { params?: { area?: string } }) {
  redirect(`/specialist-near-${params?.area || ''}`)
}
