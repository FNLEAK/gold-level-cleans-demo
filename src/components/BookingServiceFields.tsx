import { useMemo } from 'react'
import {
  bookingServiceTypes,
  isStandardCleaningService,
  standardCleaningFrequencies,
} from '../data/siteContent'
import { SelectField } from './SelectField'

type BookingServiceFieldsProps = {
  serviceId: string
  frequency: string
  onServiceChange: (serviceId: string) => void
  onFrequencyChange: (frequency: string) => void
  serviceFieldId?: string
  frequencyFieldId?: string
  serviceLabel?: string
  frequencyLabel?: string
  className?: string
}

export function BookingServiceFields({
  serviceId,
  frequency,
  onServiceChange,
  onFrequencyChange,
  serviceFieldId = 'book-service',
  frequencyFieldId = 'book-frequency',
  serviceLabel = 'Service type',
  frequencyLabel = 'Cleaning frequency',
  className = '',
}: BookingServiceFieldsProps) {
  const serviceSelectOptions = useMemo(
    () =>
      bookingServiceTypes.map((service) => ({
        value: service.id,
        label: service.label,
        hint: service.hint,
      })),
    [],
  )

  const frequencyOptions = useMemo(
    () =>
      standardCleaningFrequencies.map((option) => ({
        value: option.value,
        label: option.label,
        hint: option.hint,
      })),
    [],
  )

  return (
    <div className={className}>
      <SelectField
        id={serviceFieldId}
        label={serviceLabel}
        value={serviceId}
        onChange={onServiceChange}
        options={serviceSelectOptions}
        required
        placeholder="Choose a service"
      />

      {isStandardCleaningService(serviceId) ? (
        <div className="mt-5">
          <SelectField
            id={frequencyFieldId}
            label={frequencyLabel}
            value={frequency}
            onChange={onFrequencyChange}
            options={frequencyOptions}
            required
            placeholder="How often?"
          />
          <p className="mt-2 text-xs leading-relaxed text-fog/80">
            Standard cleaning is available one-time, weekly, bi-weekly, or monthly. We&apos;ll confirm
            your recurring schedule after your first visit.
          </p>
        </div>
      ) : null}
    </div>
  )
}
