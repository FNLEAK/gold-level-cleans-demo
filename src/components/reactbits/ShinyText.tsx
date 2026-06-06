type ShinyTextProps = {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

export function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = '',
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, #8a6d3b 0%, #bf953f 25%, #fcf6ba 45%, #d4af37 55%, #f9e29c 65%, #b38728 85%, #96780f 100%)',
        backgroundSize: '200% auto',
        animation: disabled ? 'none' : `shiny-text ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  )
}
