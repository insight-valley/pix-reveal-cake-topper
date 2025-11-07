import { ClientOnly } from './client'
import { RegisterServiceWorker } from '../register-sw'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return (
    <>
      <RegisterServiceWorker />
      <ClientOnly />
    </>
  )
}
