import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const out = path.join('store-assets', 'play')
const icon = path.join('ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png')
await sharp(icon).resize(512, 512).png().toFile(path.join(out, 'icon-512.png'))

const bg = '#04091e'
const feature = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#1e2a78"/><stop offset="1" stop-color="${bg}"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>
<rect width="1024" height="500" fill="url(#g)"/>
<circle cx="200" cy="250" r="120" fill="url(#gold)"/><text x="200" y="300" font-family="Georgia,serif" font-size="150" font-weight="bold" text-anchor="middle" fill="#04091e">€</text>
<text x="360" y="235" font-family="Arial,sans-serif" font-size="88" font-weight="bold" fill="#fff">MILIONARIO</text>
<text x="362" y="305" font-family="Arial,sans-serif" font-size="42" fill="#fbbf24">Quiz Multilingua</text>
<text x="362" y="360" font-family="Arial,sans-serif" font-size="30" fill="#c7d2fe">IT · EN · ES · FR · DE</text></svg>`)
await sharp(feature).png().toFile(path.join(out, 'feature-graphic-1024x500.png'))

const shots = (await readdir(path.join('store-assets', 'screenshots'))).filter((f) => f.includes('1290x2796'))
for (const f of shots) {
  await sharp(path.join('store-assets', 'screenshots', f))
    .resize({ width: 1080, height: 1920, fit: 'contain', background: bg })
    .png().toFile(path.join(out, 'phone-' + f.replace('1290x2796', '1080x1920')))
}
console.log('done', shots.length)
