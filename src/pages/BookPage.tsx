import { BookingForm } from '../components/BookingForm'
import { PageHeader } from '../components/PageHeader'

export function BookPage() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] pb-20 pt-10 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-28 md:pt-14">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Schedule"
          title="Book your deep clean"
          subtitle="Pick a date and we’ll reserve your spot. We take up to 7 jobs per week."
          className="mb-12"
        />
        <BookingForm />
      </div>
    </section>
  )
}
