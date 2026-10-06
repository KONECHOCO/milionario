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
 * Shows the App Tracking Transparency prompt. It has to be requested once the app is
 * active: calling it during launch (as before) makes iOS silently skip the dialog.
 */
async function requestTrackingPermission() {
  for (let attempt = 0; attempt < 3; attempt++) {
    await waitUntilVisible()
    await delay(attempt === 0 ? 1000 : 1500)
    const { status } = await AppTrackingTransparency.getStatus()
    if (status !== 'notDetermined') return status
    const result = await AppTrackingTransparency.requestPermission()
    if (result.status !== 'notDetermined') return result.status
  }
  return 'notDetermined'
}

export function initializeMonetization(): Promise<boolean> {
  if (!isNativeAdsAvailable()) return Promise.resolve(false)
  if (!initPromise) {
    initPromise = (async () => {
      try {
        // ATT decision must come before the ad SDK collects anything
        await requestTrackingPermission().catch(() => undefined)
        await withTimeout(UnityAds.initialize({ gameId: iosGameId as string, testMode }), 20000, 'Unity init')
        loadRewarded().catch(() => undefined)
        loadInterstitial().catch(() => undefined)
        return true
      } catch (error) {
        console.info('Unity Ads initialization failed', error)
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
  } catch (error) {
    if (primary === fallback) throw error
    await withTimeout(load(fallback), 15000, `load ${fallback}`)
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
    console.info('Unity Ads interstitial skipped', error)
    return false
  } finally {
    loadInterstitial().catch(() => undefined)
  }
}

/** Resolves true only when the user watched the rewarded video to completion. */
export async function showRewardedAd(): Promise<boolean> {
  if (!(await initializeMonetization())) return false
  try {
    const { loaded } = await UnityAds.isRewardedVideoLoaded()
    if (!loaded) await loadRewarded()
    const { success } = await UnityAds.showRewardedVideo()
    return success
  } catch (error) {
    console.info('Unity Ads rewarded failed', error)
    return false
  } finally {
    loadRewarded().catch(() => undefined)
  }
}
