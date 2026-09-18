import sharp from 'sharp'
import { rm } from 'node:fs/promises'
import path from 'node:path'

const src = path.join('ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png')
const res = path.join('android', 'app', 'src', 'main', 'res')
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }

// Use plain PNG launcher icons (drop the default adaptive-icon XMLs)
await rm(path.join(res, 'mipmap-anydpi-v26'), { recursive: true, force: true })
await rm(path.join(res, 'drawable-v24', 'ic_launcher_foreground.xml'), { force: true })
await rm(path.join(res, 'drawable', 'ic_launcher_background.xml'), { force: true })

for (const [d, px] of Object.entries(sizes)) {
  for (const name of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
    let img = sharp(src).resize(px, px)
    if (name.includes('round')) {
      const mask = Buffer.from(`<svg width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}"/></svg>`)
      img = img.composite([{ input: mask, blend: 'dest-in' }])
    }
    await img.png().toFile(path.join(res, `mipmap-${d}`, name))
  }
}
console.log('Android icons generated')
