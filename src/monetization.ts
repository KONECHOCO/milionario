import { Capacitor } from '@capacitor/core'
import { UnityAds } from 'capacitor-unity-ads'
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency'

const iosGameId = import.meta.env.VITE_UNITY_IOS_GAME_ID as string | undefined
const testMode = (import.meta.env.VITE_UNITY_TEST_MODE ?? 'true') !== 'false'
const interstitialPlacementId = import.meta.env.VITE_UNITY_INTERSTITIAL_PLACEMENT_ID ?? 'BP_Interstitial_iOS'
const rewardedPlacementId = import.meta.env.VITE_UNITY_REWARDED_PLACEMENT_ID ?? 'BP_Rewarded_iOS'

let initialized = false

/** True when real Unity Ads can run (native iOS build with a Game ID). */
export const isNativeAdsAvailable = () => Capacitor.isNativePlatform() && Boolean(iosGameId)

export async function initializeMonetization() {
  if (!isNativeAdsAvailable() || initialized) return

  try {
    // App Tracking Transparency prompt must precede ad SDK initialization
    await AppTrackingTransparency.requestPermission().catch(() => undefined)
    await UnityAds.initialize({ gameId: iosGameId as string, testMode })
    initialized = true
    await Promise.allSettled([
      UnityAds.loadInterstitial({ placementId: interstitialPlacementId }),
      UnityAds.loadRewardedVideo({ placementId: rewardedPlacementId }),
    ])
  } catch (error) {
    console.info('Unity Ads initialization skipped', error)
  }
}

export async function showInterstitialAd(): Promise<boolean> {
  if (!initialized) return false
  try {
    const { loaded } = await UnityAds.isInterstitialLoaded()
    if (!loaded) await UnityAds.loadInterstitial({ placementId: interstitialPlacementId })
    const { success } = await UnityAds.showInterstitial()
    return success
  } catch (error) {
    console.info('Unity Ads interstitial skipped', error)
    return false
  } finally {
    UnityAds.loadInterstitial({ placementId: interstitialPlacementId }).catch(() => undefined)
  }
}

/** Resolves true only when the user watched the rewarded video to completion. */
export async function showRewardedAd(): Promise<boolean> {
  if (!initialized) await initializeMonetization()
  if (!initialized) return false
  try {
    const { loaded } = await UnityAds.isRewardedVideoLoaded()
    if (!loaded) await UnityAds.loadRewardedVideo({ placementId: rewardedPlacementId })
    const { success } = await UnityAds.showRewardedVideo()
    return success
  } catch (error) {
    console.info('Unity Ads rewarded skipped', error)
    return false
  } finally {
    UnityAds.loadRewardedVideo({ placementId: rewardedPlacementId }).catch(() => undefined)
  }
}
