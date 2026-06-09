/**
 * Generates print-ready QR codes for Gold Level Cleans marketing.
 *
 * Usage:
 *   npm run generate-qr
 *   SITE_URL=https://goldlevel.pro/book npm run generate-qr
 *
 * Output: public/marketing/
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'marketing')
const logoPath = path.join(root, 'public', 'logo-256.webp')

const siteUrl = (process.env.SITE_URL || 'https://goldlevel.pro').replace(/\/$/, '')

const qrOptions = {
  errorCorrectionLevel: 'H',
  margin: 2,
  color: {
    dark: '#050505',
    light: '#FFFFFF',
  },
}

const outputs = [
  { name: 'qr-code.svg', type: 'svg' },
  { name: 'qr-code.png', width: 1024 },
  { name: 'qr-code-social.png', width: 1080 },
  { name: 'qr-code-print.png', width: 2400 },
  { name: 'qr-code-business-card.png', width: 600 },
]

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writeSvg(filePath) {
  const svg = await QRCode.toString(siteUrl, { ...qrOptions, type: 'svg' })
  await fs.writeFile(filePath, svg, 'utf8')
}

async function writePng(filePath, width) {
  await QRCode.toFile(filePath, siteUrl, { ...qrOptions, width })
}

async function writeBrandedPng(filePath, width) {
  const qrBuffer = await QRCode.toBuffer(siteUrl, { ...qrOptions, width })
  const logoSize = Math.round(width * 0.22)
  const pad = Math.round(logoSize * 0.12)
  const logo = await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer()

  const badgeSize = logoSize + pad * 2
  const badge = await sharp({
    create: {
      width: badgeSize,
      height: badgeSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  const badgeWithLogo = await sharp(badge)
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer()

  await sharp(qrBuffer)
    .composite([{ input: badgeWithLogo, gravity: 'center' }])
    .png()
    .toFile(filePath)
}

async function main() {
  await ensureDir(outDir)

  for (const item of outputs) {
    const filePath = path.join(outDir, item.name)
    if (item.type === 'svg') {
      await writeSvg(filePath)
    } else {
      await writePng(filePath, item.width)
    }
    console.log(`✓ ${path.relative(root, filePath)}`)
  }

  const brandedPath = path.join(outDir, 'qr-code-branded.png')
  await writeBrandedPng(brandedPath, 1024)
  console.log(`✓ ${path.relative(root, brandedPath)}`)

  const brandedPrintPath = path.join(outDir, 'qr-code-branded-print.png')
  await writeBrandedPng(brandedPrintPath, 2400)
  console.log(`✓ ${path.relative(root, brandedPrintPath)}`)

  console.log(`\nQR codes point to: ${siteUrl}`)
  console.log('Use qr-code.svg or qr-code-print.png for flyers and business cards.')
  console.log('Use qr-code-social.png for Facebook and Instagram posts.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
