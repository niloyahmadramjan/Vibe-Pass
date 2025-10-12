import { Suspense } from 'react'
import PaymentStatusClient from './PaymentStatusClient'

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading payment status...
        </div>
      }
    >
      <PaymentStatusClient />
    </Suspense>
  )
}
