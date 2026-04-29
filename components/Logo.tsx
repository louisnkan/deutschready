import Link from 'next/link'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const classes = `font-fraunces font-bold ${sizeMap[size]} cursor-pointer select-none`

  const wordmark = (
    <span className={classes}>
      <span style={{ color: '#1B4332' }}>Deutsch</span>
      <span style={{ color: '#FFB703' }}>Ready</span>
    </span>
  )

  if (href) {
    return <Link href={href}>{wordmark}</Link>
  }

  return wordmark
}
