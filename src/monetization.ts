import { Capacitor } from '@capacitor/core'
import { UnityAds } from 'capacitor-unity-ads'
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency'

const iosGameId = import.meta.env.VITE_UNITY_IOS_GAME_ID as string | undefined
const testMode = (import.meta.env.VITE_UNITY_TEST_MODE ?? 'true') !== 'false'
const interstitialPlacementId = import.meta.env.VITE_UNITY_INTERSTITIAL_PLACEMENT_ID ?? 'Interstitial_iOS'
const rewardedPlacementId = import.meta.env.VITE_UNITY_REWARDED_PLACEMENT_ID ?? 'Rewarded_iOS'

// Unity creates these ad units by default; used if the configured ones fail to load.
const FALLBACK_INTERSTITIAL = 'Interstitial_iOS'
const FALLBACK_REWARDED = 'Rewarded_iOS'

let initPromise: Promise<boolean> | null = null

/** On-device diagnostics (5 taps on the header logo), since native logs are not reachable. */
const diagnosticLog: string[] = []
export let lastAdError = ''

function logStep(message: string) {
  const time = new Date().toISOString().slice(11, 19)
  diagnosticLog.push(`${time} ${message}`)
  if (diagnosticLog.length > 40) diagnosticLog.shift()
}

const errorText = (error: unknown) => (error instanceof Error ? error.message : String((error as { message?: string })?.message ?? error))

export async function getAdDiagnostics(): Promise<string> {
  let att = 'n/a'
  try {
    att = Capacitor.isNativePlatform() ? (await AppTrackingTransparency.getStatus()).status : 'web'
  } catch (error) {
    att = 'error: ' + errorText(error)
  }
  return [
    `platform: ${Capacitor.getPlatform()} native-ads: ${isNativeAdsAvailable()}`,
    `gameId: ${iosGameId ?? '-'} testMode: ${testMode}`,
    `placements: ${rewardedPlacementId} / ${interstitialPlacementId}`,
    `ATT: ${att}`,
    `last error: ${lastAdError || '-'}`,
    '--- log ---',
    ...diagnosticLog,
  ].join('\n')
}

/** True when real Unity Ads can run (native iOS build with a Game ID). */
export const isNativeAdsAvailable = () => Capacitor.isNativePlatform() && Boolean(iosGameId)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

/** Resolves once the app is in the foreground (iOS ignores the ATT request otherwise). */
function waitUntilVisible(): Promise<void> {
  if (document.visibilityState === 'visible') return Promise.resolve()
  return new Promise((resolve) => {
    const onChange = () => {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', onChange)
      resolve()
    }
    document.addEventListener('visibilitychange', onChange)
  })
}

/**
 * Waits for the App Tracking Transparency decision. The native AppDelegate shows the prompt
 * once the app is active (iOS ignores requests made during launch); if it is still pending
 * after a few seconds the plugin asks too. Unity Ads is initialized only afterwards.
 */
async function requestTrackingPermission() {
  await waitUntilVisible()
  const startedAt = Date.now()
  let askedFromJs = false
  while (Date.now() - startedAt < 120000) {
    const { status } = await AppTrackingTransparency.getStatus()
    if (status !== 'notDetermined') {
      logStep(`ATT decided: ${status}`)
      return status
    }
    if (!askedFromJs && Date.now() - startedAt > 3000 && document.visibilityState === 'visible') {
      askedFromJs = true
      logStep('ATT still pending, requesting from plugin')
      const result = await AppTrackingTransparency.requestPermission()
      logStep(`ATT plugin result: ${result.status}`)
      if (result.status !== 'notDetermined') return result.status
    }
    await delay(500)
  }
  logStep('ATT: no decision after 120s')
  return 'notDetermined'
}

export function initializeMonetization(): Promise<boolean> {
  if (!isNativeAdsAvailable()) return Promise.resolve(false)
  if (!initPromise) {
    initPromise = (async () => {
      try {
        // ATT decision must come before the ad SDK collects anything
        await requestTrackingPermission().catch((error) => logStep('ATT error: ' + errorText(error)))
        logStep('Unity init start')
        await withTimeout(UnityAds.initialize({ gameId: iosGameId as string, testMode }), 20000, 'Unity init')
        logStep('Unity init OK')
        loadRewarded().catch(() => undefined)
        loadInterstitial().catch(() => undefined)
        return true
      } catch (error) {
        lastAdError = 'init: ' + errorText(error)
        logStep(lastAdError)
        initPromise = null // allow a retry on the next ad request
        return false
      }
    })()
  }
  return initPromise
}

async function loadWithFallback(load: (id: string) => Promise<void>, primary: string, fallback: string) {
  try {
    await withTimeout(load(primary), 15000, `load ${primary}`)
    logStep(`loaded ${primary}`)
  } catch (error) {
    lastAdError = `load ${primary}: ${errorText(error)}`
    logStep(lastAdError)
    if (primary === fallback) throw error
    try {
      await withTimeout(load(fallback), 15000, `load ${fallback}`)
      logStep(`loaded ${fallback}`)
    } catch (fallbackError) {
      logStep(`load ${fallback}: ${errorText(fallbackError)}`)
      throw error // report the configured placement's error, not the fallback's
    }
  }
}

const loadRewarded = () =>
  loadWithFallback((placementId) => UnityAds.loadRewardedVideo({ placementId }), rewardedPlacementId, FALLBACK_REWARDED)

const loadInterstitial = () =>
  loadWithFallback((placementId) => UnityAds.loadInterstitial({ placementId }), interstitialPlacementId, FALLBACK_INTERSTITIAL)

export async function showInterstitialAd(): Promise<boolean> {
  if (!(await initializeMonetization())) return false
  try {
    const { loaded } = await UnityAds.isInterstitialLoaded()
    if (!loaded) return false // never make the player wait for an unrequested ad
    const { success } = await UnityAds.showInterstitial()
    return success
  } catch (error) {
    lastAdError = 'interstitial: ' + errorText(error)
    logStep(lastAdError)
    return false
  } finally {
    loadInterstitial().catch(() => undefined)
  }
}

/** Resolves true only when the user watched the rewarded video to completion. */
export async function showRewardedAd(): Promise<boolean> {
  logStep('rewarded requested')
  if (!(await initializeMonetization())) return false
  try {
    const { loaded } = await UnityAds.isRewardedVideoLoaded()
    logStep(`rewarded loaded: ${loaded}`)
    if (!loaded) await loadRewarded()
    const { success } = await UnityAds.showRewardedVideo()
    logStep(`rewarded finished, completed: ${success}`)
    if (!success) lastAdError = 'rewarded: closed before the end'
    return success
  } catch (error) {
    lastAdError = 'rewarded: ' + errorText(error)
    logStep(lastAdError)
    return false
  } finally {
    loadRewarded().catch(() => undefined)
  }
}
