import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const iconDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset')
const splashDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset')

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="80%">
      <stop offset="0" stop-color="#2a3a9c"/>
      <stop offset="1" stop-color="#04091e"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff2b0"/>
      <stop offset="0.5" stop-color="#f5c542"/>
      <stop offset="1" stop-color="#b8860b"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <polygon points="512,130 780,270 780,754 512,894 244,754 244,270" fill="none" stroke="url(#gold)" stroke-width="26"/>
  <polygon points="512,190 730,304 730,720 512,834 294,720 294,304" fill="#0b1550" stroke="#f5c542" stroke-width="8"/>
  <text x="512" y="610" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="370" font-weight="700" fill="url(#gold)">M</text>
  <text x="512" y="715" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800" fill="#f5c542">€ 1.000.000</text>
</svg>`

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  <rect width="2732" height="2732" fill="#04091e"/>
  <g transform="translate(866 766) scale(1)">
    <svg width="1000" height="1000" viewBox="0 0 1024 1024">${iconSvg.replace(/<\/?svg[^>]*>/g, '')}</svg>
  </g>
  <text x="1366" y="1960" text-anchor="middle" font-family="Georgia, serif" font-size="150" font-weight="700" fill="#f5c542">Milionario Quiz</text>
</svg>`

await mkdir(iconDir, { recursive: true })
await mkdir(splashDir, { recursive: true })

await sharp(Buffer.from(iconSvg)).resize(1024, 1024).flatten({ background: '#04091e' }).png().toFile(path.join(iconDir, 'AppIcon-512@2x.png'))
await writeFile(path.join(iconDir, 'Contents.json'), JSON.stringify({
  images: [{ idiom: 'universal', platform: 'ios', size: '1024x1024', filename: 'AppIcon-512@2x.png' }],
  info: { version: 1, author: 'xcode' },
}, null, 2))

const splash = await sharp(Buffer.from(splashSvg)).resize(2732, 2732).png().toBuffer()
await Promise.all(['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'].map((f) => writeFile(path.join(splashDir, f), splash)))
console.log('iOS icon and splash generated')

