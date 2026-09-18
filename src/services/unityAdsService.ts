import type { UnityAdsConfig, AdStats, AdType } from '../types';

const STORAGE_CONFIG_KEY = 'milionario_unity_ads_config';
const STORAGE_STATS_KEY = 'milionario_unity_ads_stats';

const DEFAULT_CONFIG: UnityAdsConfig = {
  gameId: '5482910', // Default Unity Game ID for Milionario Quiz
  testMode: true,
  bannerPlacementId: 'Banner_Main',
  interstitialPlacementId: 'Interstitial_GameOver',
  rewardedPlacementId: 'Rewarded_Lifeline',
  bannerVisible: true,
  autoInterstitialFrequency: 3, // Show interstitial every 3 games
  simulatedEcpm: {
    banner: 3.50,
    interstitial: 18.00,
    rewarded: 28.50
  }
};

const DEFAULT_STATS: AdStats = {
  totalImpressions: 0,
  bannerImpressions: 0,
  interstitialImpressions: 0,
  rewardedImpressions: 0,
  totalEarningsUSD: 0,
  history: []
};

class UnityAdsService {
  private config: UnityAdsConfig;
  private stats: AdStats;
  private activeAdCallback: ((success: boolean, rewardReason?: string) => void) | null = null;

  constructor() {
    const savedConfig = localStorage.getItem(STORAGE_CONFIG_KEY);
    this.config = savedConfig ? { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) } : DEFAULT_CONFIG;

    const savedStats = localStorage.getItem(STORAGE_STATS_KEY);
    this.stats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS;

    this.initUnitySDKBridge();
  }

  private initUnitySDKBridge() {
    // Inject global Unity Ads Web Bridge window object if present in Unity WebGL / Mobile webviews
    if (typeof window !== 'undefined') {
      (window as unknown as { UnityAdsBridge?: unknown }).UnityAdsBridge = {
        isInitialized: true,
        gameId: this.config.gameId,
        testMode: this.config.testMode,
        showAd: (placementId: string) => this.showAd(placementId as AdType)
      };
    }
  }

  public getConfig(): UnityAdsConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<UnityAdsConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(this.config));
    this.initUnitySDKBridge();
  }

  public getStats(): AdStats {
    return { ...this.stats };
  }

  public recordImpression(type: AdType, rewardReason?: string) {
    const ecpm = this.config.simulatedEcpm[type] || 5.0;
    const earned = ecpm / 1000;

    this.stats.totalImpressions += 1;
    if (type === 'banner') this.stats.bannerImpressions += 1;
    if (type === 'interstitial') this.stats.interstitialImpressions += 1;
    if (type === 'rewarded') this.stats.rewardedImpressions += 1;

    this.stats.totalEarningsUSD += earned;

    this.stats.history.unshift({
      id: 'ad_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type,
      timestamp: new Date().toLocaleTimeString(),
      rewardGranted: rewardReason,
      ecpm,
      earned
    });

    // Keep history capped at 30 items
    if (this.stats.history.length > 30) {
      this.stats.history = this.stats.history.slice(0, 30);
    }

    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(this.stats));
  }

  public registerAdCallback(cb: (success: boolean, rewardReason?: string) => void) {
    this.activeAdCallback = cb;
  }

  public completeAd(success: boolean, rewardReason?: string) {
    if (this.activeAdCallback) {
      this.activeAdCallback(success, rewardReason);
      this.activeAdCallback = null;
    }
  }

  public showAd(type: AdType, rewardReason?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.registerAdCallback((success) => {
        if (success) {
          this.recordImpression(type, rewardReason);
        }
        resolve(success);
      });
    });
  }
}

export const unityAdsService = new UnityAdsService();
