import { BUSINESS_NAME } from '../data/siteContent'

const LOGO_SRC = '/logo.png'

type BrandLogoProps = {
  /** @deprecated use `size="compact"` */
  compact?: boolean
  size?: 'header' | 'compact' | 'auth' | 'hero'
}

const sizeClasses: Record<NonNullable<BrandLogoProps['size']>, string> = {
  compact: 'h-12 w-auto sm:h-14',
  header: 'h-12 w-auto sm:h-14',
  auth: 'h-24 w-auto sm:h-28',
  hero: 'h-auto max-h-[10.5rem] w-auto max-w-[min(100%,17rem)] sm:max-h-[11.5rem] sm:max-w-[19rem]',
}

export function BrandLogo({ compact, size }: BrandLogoProps) {
  const resolved = size ?? (compact ? 'compact' : 'header')

  return (
    <img
      src={LOGO_SRC}
      alt={BUSINESS_NAME}
      width={320}
      height={480}
      className={`block bg-transparent object-contain object-left ${sizeClasses[resolved]}`}
      decoding="async"
    />
  )
}
