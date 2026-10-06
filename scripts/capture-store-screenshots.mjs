import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

// One full set of screenshots per App Store localization:
//   store-assets/screenshots/<lang>/<device>-<n>-<step>.png
const outDir = path.join(process.cwd(), 'store-assets', 'screenshots')
const url = process.env.SCREENSHOT_URL ?? 'http://127.0.0.1:4173'

// Pretend to be the native iOS shell so simulated web-only ad widgets are hidden.
const nativeShim = (lang) => {
  window.webkit = { messageHandlers: { bridge: { postMessage() {} } } }
  localStorage.setItem('milionario_language', lang)
}

const devices = {
  iphone: { width: 440, height: 956, dpr: 3 }, // 1320x2868 (6.9")
  ipad: { width: 1032, height: 1376, dpr: 2 }, // 2064x2752 (13")
}

const languages = ['it', 'en', 'es', 'fr', 'de']
const steps = ['menu', 'selected', 'audience', 'expert', 'blitz']


await rm(outDir, { recursive: true, force: true })
const browser = await chromium.launch()
for (const lang of languages) {
  await mkdir(path.join(outDir, lang), { recursive: true })
  for (const [deviceName, dev] of Object.entries(devices)) {
    for (const [i, step] of steps.entries()) {
      const ctx = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        deviceScaleFactor: dev.dpr,
        isMobile: deviceName === 'iphone',
        hasTouch: true,
      })
      const page = await ctx.newPage()
      await page.addInitScript(nativeShim, lang)
      await page.goto(url, { waitUntil: 'networkidle' })
      if (step !== 'menu') {
        // Mode buttons: 0 classic, 1 super, 2 lightning round, 3 daily
        const modeButtons = page.locator('main button')
        await modeButtons.nth(step === 'blitz' ? 2 : 0).click()
        await page.waitForSelector('.option-prefix')
        if (step === 'selected') await page.locator('.option-hexagon').nth(1).click()
        if (step === 'audience') await page.locator('.lifeline-btn').nth(1).click()
        if (step === 'expert') await page.locator('.lifeline-btn').nth(2).click()
        if (step === 'blitz') await page.waitForTimeout(4200)
        await page.waitForTimeout(1600)
      }
      const file = `${deviceName}-${i + 1}-${step}.png`
      await page.screenshot({ path: path.join(outDir, lang, file) })
      await ctx.close()
    }
  }
  console.log(`Captured ${lang}`)
}
await browser.close()
