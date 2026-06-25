export function openAppointmentModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openAppointmentModal'))
  }
}
