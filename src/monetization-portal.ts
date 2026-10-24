// Monetization for web game portals, used instead of ./monetization.ts by vite.config.ts.
// - crazygames: CrazyGames SDK v3 ads (rewarded video for the extra lifeline and the revive,
//   a midgame ad between games at most every 3 minutes), gameplay and loading events.
// - itch: no ads; rewards are always granted.
// Same exports as monetization.ts, so App.tsx does not change between builds.

type CrazySDK = {
  init(): Promise<void>
  game: { gameplayStart(): void; gameplayStop(): void; loadingStop(): void }
  ad: { requestAd(type: 'midgame' | 'rewarded', cb: { adStarted?: () => void; adFinished?: () => void; adError?: (e: unknown) => void }): void }
}

const PORTAL = import.meta.env.VITE_PORTAL as string | undefined
const sdk = (): CrazySDK | undefined =>
  PORTAL === 'crazygames' ? (window as unknown as { CrazyGames?: { SDK?: CrazySDK } }).CrazyGames?.SDK : undefined

const MIN_GAP_BETWEEN_MIDGAME_MS = 3 * 60 * 1000
let ready = false
let initPromise: Promise<boolean> | null = null
let playing = false
let lastMidgameAt = Date.now()
export let lastAdError = ''

export async function getAdDiagnostics(): Promise<string> {
  return `portal=${PORTAL} ready=${ready} lastError=${lastAdError || '-'}`
}

/** On the portals the ad path is always the real one: never the simulated preview modal. */
export const isNativeAdsAvailable = () => true

export function initializeMonetization(): Promise<boolean> {
  const s = sdk()
  if (!s) return Promise.resolve(false)
  if (!initPromise) {
    initPromise = s.init().then(() => {
      ready = true
      s.game.loadingStop()
      if (playing) s.game.gameplayStart()
      return true
    }).catch((error) => {
      lastAdError = String(error)
      return false
    })
  }
  return initPromise
}

/** The app reports when a game is running: the portal pauses its own features meanwhile. */
export function setGameplayActive(active: boolean) {
  if (active === playing) return
  playing = active
  const s = sdk()
  if (!s || !ready) return
  try {
    if (active) s.game.gameplayStart()
    else s.game.gameplayStop()
  } catch {
    // ignore SDK errors
  }
}

function requestAd(type: 'midgame' | 'rewarded'): Promise<boolean> {
  const s = sdk()
  if (!s || !ready) return Promise.resolve(false)
  return new Promise((resolve) => {
    s.ad.requestAd(type, {
      adFinished: () => resolve(true),
      adError: (error) => {
        lastAdError = `${type}: ${String((error as { code?: string })?.code ?? error)}`
        resolve(false)
      },
    })
  })
}

export async function showInterstitialAd(): Promise<boolean> {
  if (PORTAL !== 'crazygames' || playing) return false
  if (Date.now() - lastMidgameAt < MIN_GAP_BETWEEN_MIDGAME_MS) return false
  lastMidgameAt = Date.now()
  return requestAd('midgame')
}

/** Resolves true when the reward is earned: always on itch.io, after a full video on CrazyGames. */
export async function showRewardedAd(): Promise<boolean> {
  if (PORTAL !== 'crazygames') return true
  if (!(await initializeMonetization())) return false
  return requestAd('rewarded')
}
