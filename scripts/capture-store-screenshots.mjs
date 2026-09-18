import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const outDir = path.join(process.cwd(), 'store-assets', 'screenshots')
const url = process.env.SCREENSHOT_URL ?? 'http://127.0.0.1:4173'

// Pretend to be the native iOS shell so simulated web-only ad widgets are hidden.
const nativeShim = () => {
  window.webkit = { messageHandlers: { bridge: { postMessage() {} } } }
}

const iphone = { width: 428, height: 926, dpr: 3 } // 1284x2778 (6.5")
const ipad = { width: 1032, height: 1376, dpr: 2 } // 2064x2752 (13")

// steps: 'menu' | 'question' | 'selected' | 'audience' | 'fifty'
const shots = [
  { name: '01-menu-it', dev: iphone, lang: 'it', step: 'menu' },
  { name: '02-question-en', dev: iphone, lang: 'en', step: 'question' },
  { name: '03-selected-es', dev: iphone, lang: 'es', step: 'selected' },
  { name: '04-audience-fr', dev: iphone, lang: 'fr', step: 'audience' },
  { name: '05-fifty-de', dev: iphone, lang: 'de', step: 'fifty' },
  { name: '06-menu-ipad-en', dev: ipad, lang: 'en', step: 'menu' },
  { name: '07-question-ipad-it', dev: ipad, lang: 'it', step: 'question' },
]

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.dev.width, height: s.dev.height },
    deviceScaleFactor: s.dev.dpr,
    isMobile: s.dev.dpr === 3,
    hasTouch: true,
  })
  const page = await ctx.newPage()
  await page.addInitScript(nativeShim)
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('select').first().selectOption(s.lang)
  if (s.step !== 'menu') {
    await page.locator('button:has-text("15")').first().click()
    await page.waitForSelector('.option-prefix')
    if (s.step === 'selected') await page.locator('.option-prefix').nth(1).click()
    if (s.step === 'audience') await page.locator('.lifeline-btn').nth(1).click()
    if (s.step === 'fifty') await page.locator('.lifeline-btn').nth(0).click()
    await page.waitForTimeout(600)
  }
  await page.screenshot({ path: path.join(outDir, `${s.name}-${s.dev.width * s.dev.dpr}x${s.dev.height * s.dev.dpr}.png`) })
  await ctx.close()
}
await browser.close()
