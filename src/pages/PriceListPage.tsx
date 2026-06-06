import { PageHeader } from '../components/PageHeader'
import { PricingSection } from '../components/PricingSection'
import { pricesSectionHeading } from '../data/siteContent'

export function PriceListPage() {
  return (
    <>
      <div className="px-4 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <PageHeader eyebrow="Price List" title={pricesSectionHeading} />
        </div>
      </div>
      <PricingSection hideSectionTitle />
    </>
  )
}
