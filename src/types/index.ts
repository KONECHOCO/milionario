export type Language = 'it' | 'en' | 'es' | 'fr' | 'de';

export type GameMode = 'classic' | 'super' | 'blitz';

export interface LocalizedString {
  it: string;
  en: string;
  es: string;
  fr: string;
  de: string;
}

export interface LocalizedOptions {
  it: [string, string, string, string];
  en: [string, string, string, string];
  es: [string, string, string, string];
  fr: [string, string, string, string];
  de: [string, string, string, string];
}

export interface Question {
  id: string;
  level: number; // 1 to 25
  category: string;
  question: LocalizedString;
  options: LocalizedOptions;
  correctAnswer: number; // 0, 1, 2, or 3
  explanation?: LocalizedString;
}

export interface LifelineState {
  used: boolean;
  active: boolean;
}

export interface Lifelines {
  fiftyFifty: LifelineState;
  audience: LifelineState;
  expert: LifelineState;
  swap: LifelineState;
  rewardedExtra: LifelineState;
}

export interface AudienceVote {
  option: number;
  percentage: number;
}

export interface ExpertAdvice {
  expertName: string;
  role: string;
  avatar: string;
  confidence: number;
  suggestedAnswer: number;
  dialogue: string;
}

export type AdType = 'banner' | 'interstitial' | 'rewarded';

export interface UnityAdsConfig {
  gameId: string;
  testMode: boolean;
  bannerPlacementId: string;
  interstitialPlacementId: string;
  rewardedPlacementId: string;
  bannerVisible: boolean;
  autoInterstitialFrequency: number; // Every X games
  simulatedEcpm: {
    banner: number;
    interstitial: number;
    rewarded: number;
  };
}

export interface AdStats {
  totalImpressions: number;
  bannerImpressions: number;
  interstitialImpressions: number;
  rewardedImpressions: number;
  totalEarningsUSD: number;
  history: Array<{
    id: string;
    type: AdType;
    timestamp: string;
    rewardGranted?: string;
    ecpm: number;
    earned: number;
  }>;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalWinnings: number;
  classicWins: number;
  superWins: number;
  highestLadderLevel: number;
  correctAnswersCount: number;
  lifelinesUsedCount: number;
  achievements: string[];
}
