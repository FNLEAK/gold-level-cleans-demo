import { BUSINESS_NAME } from '../data/siteContent'

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

const webpBySize: Record<NonNullable<BrandLogoProps['size']>, { src: string; srcSet: string }> = {
  compact: { src: '/logo-96.webp', srcSet: '/logo-96.webp 96w, /logo-256.webp 256w' },
  header: { src: '/logo-96.webp', srcSet: '/logo-96.webp 96w, /logo-256.webp 256w' },
  auth: { src: '/logo-256.webp', srcSet: '/logo-256.webp 256w, /logo-512.webp 512w' },
  hero: { src: '/logo-256.webp', srcSet: '/logo-256.webp 256w, /logo-512.webp 512w' },
}

export function BrandLogo({ compact, size }: BrandLogoProps) {
  const resolved = size ?? (compact ? 'compact' : 'header')
  const webp = webpBySize[resolved]
  const isAboveFold = resolved === 'header' || resolved === 'compact' || resolved === 'hero'

  return (
    <picture>
      <source type="image/webp" srcSet={webp.srcSet} sizes={resolved === 'hero' ? '17rem' : '3.5rem'} />
      <img
        src={webp.src}
        alt={BUSINESS_NAME}
        width={320}
        height={480}
        className={`block bg-transparent object-contain object-left ${sizeClasses[resolved]}`}
        decoding="async"
        loading={isAboveFold ? 'eager' : 'lazy'}
        fetchPriority={isAboveFold ? 'high' : 'auto'}
      />
    </picture>
  )
}
