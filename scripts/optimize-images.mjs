import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

async function writeWebp(input, output, width, quality = 82) {
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(output)
  const kb = (info.size / 1024).toFixed(1)
  console.log(`  ${path.basename(output)} — ${kb} KB (${info.width}×${info.height})`)
}

console.log('Optimizing logo…')
await writeWebp(path.join(publicDir, 'logo.png'), path.join(publicDir, 'logo-96.webp'), 96, 85)
await writeWebp(path.join(publicDir, 'logo.png'), path.join(publicDir, 'logo-256.webp'), 256, 85)
await writeWebp(path.join(publicDir, 'logo.png'), path.join(publicDir, 'logo-512.webp'), 512, 82)

console.log('Optimizing headshot…')
await writeWebp(
  path.join(publicDir, 'mykala-ashbaugh.jpg'),
  path.join(publicDir, 'mykala-288.webp'),
  288,
  80,
)
await writeWebp(
  path.join(publicDir, 'mykala-ashbaugh.jpg'),
  path.join(publicDir, 'mykala-576.webp'),
  576,
  82,
)

console.log('Done.')
