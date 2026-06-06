import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const logoPath = path.join(root, 'public', 'logo.png')
const outPath = path.join(root, 'public', 'logo-transparent.png')

const { data, info } = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const luminance = Math.max(r, g, b)

  if (luminance <= 40) {
    data[i + 3] = 0
  } else if (luminance <= 96) {
    data[i + 3] = Math.round(((luminance - 40) / 56) * 255)
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 12 })
  .png()
  .toFile(outPath)

console.log('Logo processed:', outPath)
