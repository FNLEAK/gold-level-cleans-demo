import { BookingForm } from '../components/BookingForm'
import { PageHeader } from '../components/PageHeader'

export function BookPage() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] pb-20 pt-10 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-28 md:pt-14">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Schedule"
          title="Book your cleaning"
          subtitle="Choose your service type and preferred date. We take up to 7 jobs per week and confirm your quote before we accept."
          className="mb-12"
        />
        <BookingForm />
      </div>
    </section>
  )
}
