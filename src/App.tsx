import { useState, useEffect, useRef } from 'react';
import type {
  Language,
  GameMode,
  Lifelines as LifelinesType,
  AudienceVote,
  ExpertAdvice,
  AdType,
  PlayerStats,
  Question
} from './types';
import { UI_TRANSLATIONS } from './i18n/translations';
import {
  getPrizeLadder,
  getSafetyCheckpoints,
  getRandomQuestionForLevel,
  seededRandom,
  BLITZ_SECONDS_PER_QUESTION,
  QUESTION_COUNT
} from './data/questions';

import { audioEngine } from './services/audioEngine';
import { unityAdsService } from './services/unityAdsService';

import { StudioBackground } from './components/StudioBackground';
import { Header } from './components/Header';
import { PrizeLadder } from './components/PrizeLadder';
import { QuestionCard } from './components/QuestionCard';
import { Lifelines } from './components/Lifelines';

import { AudienceModal } from './components/modals/AudienceModal';
import { ExpertModal } from './components/modals/ExpertModal';
import { UnityAdsModal } from './components/modals/UnityAdsModal';
import { UnityDevDashboard } from './components/modals/UnityDevDashboard';
import { GameOverModal } from './components/modals/GameOverModal';
import { StatsModal } from './components/modals/StatsModal';

import { Play, Zap, LogOut, Tv, Timer, CalendarDays, Flame } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { isNativeAdsAvailable, showInterstitialAd, showRewardedAd, getAdDiagnostics, lastAdError } from './monetization';

const DEFAULT_LIFELINES: LifelinesType = {
  fiftyFifty: { used: false, active: true },
  audience: { used: false, active: true },
  expert: { used: false, active: true },
  swap: { used: false, active: true },
  rewardedExtra: { used: false, active: true }
};

const STATS_STORAGE_KEY = 'milionario_player_stats';
const LANGUAGE_STORAGE_KEY = 'milionario_language';
const DAILY_STORAGE_KEY = 'milionario_daily';

const DEFAULT_PLAYER_STATS: PlayerStats = {
  gamesPlayed: 0,
  totalWinnings: 0,
  classicWins: 0,
  superWins: 0,
  highestLadderLevel: 0,
  correctAnswersCount: 0,
  lifelinesUsedCount: 0,
  achievements: []
};

const AD_UNAVAILABLE: Record<string, string> = {
  it: 'Video non disponibile o non completato, riprova tra poco.',
  en: 'Video unavailable or not completed, please try again shortly.',
  es: 'Vídeo no disponible o no completado, inténtalo de nuevo en unos instantes.',
  fr: "Vidéo indisponible ou non terminée, réessayez dans un instant.",
  de: 'Video nicht verfügbar oder nicht abgeschlossen, bitte gleich erneut versuchen.'
};

const SUPPORTED_LANGUAGES: Language[] = ['it', 'en', 'es', 'fr', 'de'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const safeStorageGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore: storage can be unavailable
  }
};

/** Saved choice first, then the device language, then English. */
function initialLanguage(): Language {
  const saved = safeStorageGet(LANGUAGE_STORAGE_KEY) as Language | null;
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
  const preferred = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2).toLowerCase());
  return (preferred.find((l) => SUPPORTED_LANGUAGES.includes(l as Language)) as Language) ?? 'en';
}

const todayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
};

interface DailyState {
  lastPlayed: string;
  streak: number;
  bestStreak: number;
}

function readDailyState(): DailyState {
  try {
    const saved = JSON.parse(safeStorageGet(DAILY_STORAGE_KEY) ?? 'null');
    if (saved && typeof saved.lastPlayed === 'string') return saved;
  } catch {
    // fall through to defaults
  }
  return { lastPlayed: '', streak: 0, bestStreak: 0 };
}

const isTimedMode = (mode: GameMode) => mode === 'blitz' || mode === 'daily';

export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [answerState, setAnswerState] = useState<'idle' | 'selected' | 'locked' | 'correct' | 'wrong'>('idle');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState<boolean>(false);

  const [lifelines, setLifelines] = useState<LifelinesType>(DEFAULT_LIFELINES);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const rngRef = useRef<() => number>(Math.random);

  // Modals state
  const [showAudienceModal, setShowAudienceModal] = useState<boolean>(false);
  const [audienceVotes, setAudienceVotes] = useState<AudienceVote[]>([]);

  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [expertAdvice, setExpertAdvice] = useState<ExpertAdvice | null>(null);

  const [activeAd, setActiveAd] = useState<{ type: AdType; reason?: string } | null>(null);
  const [adLoading, setAdLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showUnityDashboard, setShowUnityDashboard] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  // GameOver state
  const [finalWonAmount, setFinalWonAmount] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isSafetyRetained, setIsSafetyRetained] = useState<boolean>(false);
  const [canRevive, setCanRevive] = useState<boolean>(true);

  // Player Stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = safeStorageGet(STATS_STORAGE_KEY);
      return saved ? { ...DEFAULT_PLAYER_STATS, ...JSON.parse(saved) } : DEFAULT_PLAYER_STATS;
    } catch {
      return DEFAULT_PLAYER_STATS;
    }
  });
  const [daily, setDaily] = useState<DailyState>(readDailyState);

  const [unityStats, setUnityStats] = useState(unityAdsService.getStats());

  const t = UI_TRANSLATIONS[language];
  const prizeLadder = getPrizeLadder(gameMode);
  const safetyCheckpoints = getSafetyCheckpoints(gameMode);
  const dailyDoneToday = daily.lastPlayed === todayKey();
  const visibleStreak = daily.lastPlayed === todayKey() || daily.lastPlayed === yesterdayKey() ? daily.streak : 0;

  useEffect(() => {
    safeStorageSet(STATS_STORAGE_KEY, JSON.stringify(playerStats));
  }, [playerStats]);

  useEffect(() => {
    safeStorageSet(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  // Countdown for the timed modes; paused while a lifeline popup or an ad is on screen.
  const timerPaused = showAudienceModal || showExpertModal || adLoading || activeAd !== null;
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft === null || timerPaused) return;
    if (answerState !== 'idle' && answerState !== 'selected') return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState, answerState, timerPaused]);

  // Hidden diagnostics: 5 quick taps on the logo
  const logoTaps = useRef<number[]>([]);
  const [diagnostics, setDiagnostics] = useState<string | null>(null);
  const handleLogoTap = () => {
    const now = Date.now();
    logoTaps.current = [...logoTaps.current.filter((t) => now - t < 3000), now];
    if (logoTaps.current.length >= 5) {
      logoTaps.current = [];
      getAdDiagnostics().then(setDiagnostics);
    }
  };

  const refreshAdStats = () => {
    setUnityStats(unityAdsService.getStats());
  };

  const handleToggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const resetTimer = (mode: GameMode = gameMode) => {
    setTimedOut(false);
    setTimeLeft(isTimedMode(mode) ? BLITZ_SECONDS_PER_QUESTION : null);
  };

  // Helper to load a randomized question for a level
  const loadRandomQuestion = (levelNumber: number, usedSet: Set<string>, mode: GameMode = gameMode) => {
    const q = getRandomQuestionForLevel(levelNumber, usedSet, mode, rngRef.current);
    setCurrentQuestion(q);
    const newSet = new Set(usedSet);
    newSet.add(q.id);
    setUsedQuestionIds(newSet);
    return newSet;
  };

  // Start new game
  const handleStartGame = (mode: GameMode) => {
    if (mode === 'daily' && dailyDoneToday) return;
    rngRef.current = mode === 'daily' ? seededRandom(`daily-${todayKey()}`) : Math.random;

    setGameMode(mode);
    setGameState('playing');
    setCurrentLevelIndex(0);
    setSelectedOption(null);
    setDisabledOptions([]);
    setAnswerState('idle');
    setLifelines(DEFAULT_LIFELINES);
    setCanRevive(mode !== 'daily');
    resetTimer(mode);

    loadRandomQuestion(1, new Set<string>(), mode);

    audioEngine.startTensionBGM();
    setPlayerStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  // Option selection
  const handleSelectOption = (idx: number) => {
    if (answerState === 'locked' || answerState === 'correct' || answerState === 'wrong') return;
    audioEngine.playSelect();
    setSelectedOption(idx);
    setAnswerState('selected');
  };

  const handleWrongAnswer = () => {
    setAnswerState('wrong');
    audioEngine.playWrong();

    // Calculate safety prize
    let safetyPrize = 0;
    let retained = false;

    const achievedLevel = currentLevelIndex + 1;
    const reachedSafeties = safetyCheckpoints.filter((l) => l < achievedLevel);
    if (reachedSafeties.length > 0) {
      const maxSafetyLevel = Math.max(...reachedSafeties);
      safetyPrize = prizeLadder[maxSafetyLevel - 1];
      retained = true;
    }

    // Leave time to see the right answer flashing in green
    setTimeout(() => {
      handleEndGame(safetyPrize, false, retained);
    }, 3200);
  };

  const handleTimeUp = () => {
    if (!currentQuestion) return;
    setTimedOut(true);
    setSelectedOption(null);
    handleWrongAnswer();
  };

  // Confirm Answer
  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setAnswerState('locked');
    audioEngine.playLock();

    // Reveal after a short suspense delay
    setTimeout(() => {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;

      if (isCorrect) {
        setAnswerState('correct');
        audioEngine.playCorrect();

        const wonThisRound = prizeLadder[currentLevelIndex];
        const isLastQuestion = currentLevelIndex === prizeLadder.length - 1;

        setPlayerStats((prev) => ({
          ...prev,
          correctAnswersCount: prev.correctAnswersCount + 1,
          highestLadderLevel: Math.max(prev.highestLadderLevel, currentLevelIndex + 1)
        }));

        setTimeout(() => {
          if (isLastQuestion) {
            handleEndGame(wonThisRound, true, false);
          } else {
            // Advance to next level with fresh randomized question
            const nextLevelIdx = currentLevelIndex + 1;
            setCurrentLevelIndex(nextLevelIdx);
            loadRandomQuestion(nextLevelIdx + 1, usedQuestionIds);
            setSelectedOption(null);
            setDisabledOptions([]);
            setAnswerState('idle');
            resetTimer();
          }
        }, 2200);
      } else {
        handleWrongAnswer();
      }
    }, isTimedMode(gameMode) ? 900 : 1800);
  };

  const recordDailyPlayed = () => {
    setDaily((prev) => {
      const today = todayKey();
      if (prev.lastPlayed === today) return prev;
      const streak = prev.lastPlayed === yesterdayKey() ? prev.streak + 1 : 1;
      const next = { lastPlayed: today, streak, bestStreak: Math.max(prev.bestStreak, streak) };
      safeStorageSet(DAILY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // End game summary
  const handleEndGame = (won: number, victory: boolean, safetyRetained: boolean, walkedAway = false) => {
    audioEngine.stopTensionBGM();
    setFinalWonAmount(won);
    setIsVictory(victory);
    setIsSafetyRetained(safetyRetained);
    setGameState('gameover');
    setTimeLeft(null);

    if (victory) {
      audioEngine.playVictory();
    }
    if (gameMode === 'daily') recordDailyPlayed();

    setPlayerStats((prev) => ({
      ...prev,
      totalWinnings: prev.totalWinnings + won,
      classicWins: victory && gameMode === 'classic' ? prev.classicWins + 1 : prev.classicWins,
      superWins: victory && gameMode === 'super' ? prev.superWins + 1 : prev.superWins
    }));

    // Interstitial every few games, never when the player can still use the revive video
    const config = unityAdsService.getConfig();
    if (walkedAway) setCanRevive(false);
    const offerRevive = canRevive && !victory && !walkedAway;
    if (!offerRevive && (playerStats.gamesPlayed % config.autoInterstitialFrequency === 0)) {
      setTimeout(() => {
        requestAd({ type: 'interstitial' });
      }, 1000);
    }
  };

  // Walk Away with cash
  const handleWalkAway = () => {
    const cashOutAmount = currentLevelIndex > 0 ? prizeLadder[currentLevelIndex - 1] : 0;
    handleEndGame(cashOutAmount, false, false, true);
  };

  const countLifelineUse = () => {
    setPlayerStats((prev) => ({ ...prev, lifelinesUsedCount: prev.lifelinesUsedCount + 1 }));
  };

  /** 0 at the first question, 1 at the last one. */
  const difficulty = () => (prizeLadder.length > 1 ? currentLevelIndex / (prizeLadder.length - 1) : 0);

  // Lifeline 1: 50:50
  const handleUseFiftyFifty = () => {
    if (lifelines.fiftyFifty.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();
    countLifelineUse();

    const correct = currentQuestion.correctAnswer;
    const wrongOptions = [0, 1, 2, 3].filter((idx) => idx !== correct && !disabledOptions.includes(idx));
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);

    setDisabledOptions([...disabledOptions, ...shuffled.slice(0, 2)]);
    setLifelines((prev) => ({
      ...prev,
      fiftyFifty: { used: true, active: false }
    }));
  };

  // Lifeline 2: Ask Audience — less reliable as the questions get harder
  const handleUseAudience = () => {
    if (lifelines.audience.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();
    countLifelineUse();

    const correct = currentQuestion.correctAnswer;
    const remaining = [0, 1, 2, 3].filter((i) => !disabledOptions.includes(i));
    const wrong = remaining.filter((i) => i !== correct);

    const base = 78 - 38 * difficulty(); // ~78% on easy questions, ~40% on the hardest
    let correctPct = Math.round(Math.min(92, Math.max(28, base + (Math.random() * 16 - 8))));
    if (wrong.length === 0) correctPct = 100;

    const weights = wrong.map(() => Math.random() + 0.2);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const wrongPcts = weights.map((w) => Math.floor(((100 - correctPct) * w) / totalWeight));
    // Give rounding leftovers to the correct answer so the total is exactly 100
    correctPct = 100 - wrongPcts.reduce((a, b) => a + b, 0);

    const votes: AudienceVote[] = [0, 1, 2, 3].map((i) => {
      if (i === correct) return { option: i, percentage: correctPct };
      const wi = wrong.indexOf(i);
      return { option: i, percentage: wi >= 0 ? wrongPcts[wi] : 0 };
    });

    setAudienceVotes(votes);
    setShowAudienceModal(true);
    setLifelines((prev) => ({
      ...prev,
      audience: { used: true, active: false }
    }));
  };

  // Lifeline 3: Expert call — may hesitate (and occasionally be wrong) on hard questions
  const handleUseExpert = () => {
    if (lifelines.expert.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();
    countLifelineUse();

    const optionsText = currentQuestion.options[language] || currentQuestion.options.it;
    const correctIdx = currentQuestion.correctAnswer;
    const d = difficulty();
    const confidence = Math.round(95 - 50 * d + (Math.random() * 10 - 5));
    const wrongChoices = [0, 1, 2, 3].filter((i) => i !== correctIdx && !disabledOptions.includes(i));
    const isWrong = wrongChoices.length > 0 && Math.random() < 0.3 * d;
    const suggested = isWrong ? wrongChoices[Math.floor(Math.random() * wrongChoices.length)] : correctIdx;
    const template = confidence >= 70 ? t.expertSure : t.expertUnsure;

    const advice: ExpertAdvice = {
      expertName: 'Prof. Sofia Moretti',
      role: t.expertRole,
      avatar: 'expert_1',
      confidence,
      suggestedAnswer: suggested,
      dialogue: template.replace('{letter}', OPTION_LETTERS[suggested]).replace('{answer}', optionsText[suggested])
    };

    setExpertAdvice(advice);
    setShowExpertModal(true);
    setLifelines((prev) => ({
      ...prev,
      expert: { used: true, active: false }
    }));
  };

  // Lifeline 4: Swap Question
  const handleUseSwap = () => {
    if (lifelines.swap.used || answerState !== 'idle') return;
    audioEngine.playLifeline();
    countLifelineUse();

    loadRandomQuestion(currentLevelIndex + 1, usedQuestionIds);
    setSelectedOption(null);
    setDisabledOptions([]);
    resetTimer();

    setLifelines((prev) => ({
      ...prev,
      swap: { used: true, active: false }
    }));
  };

  // Lifeline 5: Rewarded video unlocks an extra 50:50
  const handleWatchAdExtraLifeline = () => {
    requestAd({ type: 'rewarded', reason: 'Extra Lifeline Unlock' });
  };

  // Rewarded video revive
  const handleWatchAdRevive = () => {
    requestAd({ type: 'rewarded', reason: 'Game Revive / Second Chance' });
  };

  // Real Unity Ads on native iOS; simulated modal in the web preview.
  const requestAd = (ad: { type: AdType; reason?: string }) => {
    if (!isNativeAdsAvailable()) {
      setActiveAd(ad);
      return;
    }
    if (ad.type === 'rewarded') {
      if (adLoading) return;
      setAdLoading(true);
      audioEngine.stopTensionBGM();
      showRewardedAd().then((granted) => {
        setAdLoading(false);
        if (!granted) {
          setNotice(`${AD_UNAVAILABLE[language]}${lastAdError ? `\n(${lastAdError})` : ''}`);
          if (gameState === 'playing') audioEngine.startTensionBGM();
        }
        applyAdReward(granted, ad.reason);
      });
    } else if (ad.type === 'interstitial') {
      showInterstitialAd();
    }
  };

  const handleAdClosed = (rewardGranted: boolean) => {
    refreshAdStats();
    applyAdReward(rewardGranted, activeAd?.reason);
    setActiveAd(null);
  };

  const applyAdReward = (rewardGranted: boolean, reason?: string) => {
    if (rewardGranted && reason) {
      if (reason === 'Extra Lifeline Unlock') {
        setLifelines((prev) => ({
          ...prev,
          fiftyFifty: { used: false, active: true },
          rewardedExtra: { used: true, active: false }
        }));
      } else if (reason === 'Game Revive / Second Chance') {
        // Second chance on a new question of the same level (the old one was revealed)
        loadRandomQuestion(currentLevelIndex + 1, usedQuestionIds);
        setGameState('playing');
        setAnswerState('idle');
        setSelectedOption(null);
        setDisabledOptions([]);
        setCanRevive(false);
        resetTimer();
        audioEngine.startTensionBGM();
      }
    }
  };

  const modeButtonBase = {
    border: 'none',
    borderRadius: '20px',
    padding: '24px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StudioBackground />

      <Header
        currentLanguage={language}
        onLanguageChange={(lang) => setLanguage(lang)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenUnityDashboard={() => setShowUnityDashboard(true)}
        unityImpressionsCount={unityStats.totalImpressions}
        onLogoTap={handleLogoTap}
      />

      {/* Main Content View */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: '0 16px 24px 16px' }}>
        {gameState === 'menu' && (
          <div
            style={{
              maxWidth: '900px',
              margin: '40px auto 0 auto',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            {/* Main Menu Hero Card */}
            <div
              className="glass-panel"
              style={{
                padding: '48px 32px',
                borderRadius: '28px',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 0 50px rgba(245, 158, 11, 0.4)',
                marginBottom: '32px'
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--gold-gradient)',
                  margin: '0 auto 20px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '2.8rem',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 0 35px rgba(245, 158, 11, 0.8)'
                }}
              >
                €
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #fff 0%, var(--gold-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '12px'
                }}
              >
                {t.appTitle}
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 8px auto' }}>
                {t.classicDesc}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '32px' }}>
                {QUESTION_COUNT}+ {t.questionsInBank}
              </p>

              {/* Game Mode Selection Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
                <button
                  onClick={() => handleStartGame('classic')}
                  style={{
                    ...modeButtonBase,
                    background: 'var(--gold-gradient)',
                    color: '#000',
                    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Play size={24} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                      {t.playClassic}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
                    {t.classicInfo}
                  </p>
                </button>

                <button
                  onClick={() => handleStartGame('super')}
                  style={{
                    ...modeButtonBase,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Zap size={24} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                      {t.playSuper}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
                    {t.superInfo}
                  </p>
                </button>

                <button
                  onClick={() => handleStartGame('blitz')}
                  style={{
                    ...modeButtonBase,
                    background: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(225, 29, 72, 0.45)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Timer size={24} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                      {t.playBlitz}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
                    {t.blitzDesc}
                  </p>
                </button>

                <button
                  onClick={() => handleStartGame('daily')}
                  disabled={dailyDoneToday}
                  style={{
                    ...modeButtonBase,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.45)',
                    opacity: dailyDoneToday ? 0.6 : 1,
                    cursor: dailyDoneToday ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <CalendarDays size={24} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', flex: 1 }}>
                      {t.playDaily}
                    </h3>
                    {visibleStreak > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 900 }}>
                        <Flame size={18} color="#fde047" /> {visibleStreak}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
                    {dailyDoneToday ? t.dailyDone : t.dailyDesc}
                  </p>
                </button>
              </div>
            </div>

            {/* Simulated banner placeholder (web preview only) */}
            {!Capacitor.isNativePlatform() && <div
              className="glass-panel"
              style={{
                padding: '14px 20px',
                borderRadius: '16px',
                border: '1px solid #4338ca',
                background: 'rgba(30, 27, 75, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '720px',
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Tv size={20} color="#818cf8" />
                <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700 }}>
                  {t.unityBanner}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Game ID: {unityAdsService.getConfig().gameId}
              </span>
            </div>}
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Main Game Column */}
            <div style={{ flex: 1, minWidth: 'min(320px, 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Lifelines
                lifelines={lifelines}
                currentLanguage={language}
                onUseFiftyFifty={handleUseFiftyFifty}
                onUseAudience={handleUseAudience}
                onUseExpert={handleUseExpert}
                onUseSwap={handleUseSwap}
                onWatchAdExtraLifeline={handleWatchAdExtraLifeline}
                disabled={adLoading || answerState === 'locked' || answerState === 'correct' || answerState === 'wrong'}
              />

              <QuestionCard
                question={currentQuestion}
                currentLanguage={language}
                selectedOption={selectedOption}
                disabledOptions={disabledOptions}
                answerState={answerState}
                onSelectOption={handleSelectOption}
                onConfirmAnswer={handleConfirmAnswer}
                timeLeft={timeLeft}
                timeLimit={BLITZ_SECONDS_PER_QUESTION}
                timedOut={timedOut}
              />

              {/* Walk Away Cash Out Button */}
              {currentLevelIndex > 0 && answerState === 'idle' && (
                <button
                  onClick={handleWalkAway}
                  style={{
                    marginTop: '20px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    color: '#fca5a5',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={16} />
                  <span>{t.walkAway} ({new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prizeLadder[currentLevelIndex - 1])})</span>
                </button>
              )}
            </div>

            {/* Right Prize Ladder Sidebar */}
            <PrizeLadder
              prizeLadder={prizeLadder}
              currentLevelIndex={currentLevelIndex}
              safetyCheckpoints={safetyCheckpoints}
              title={t.prizeLadder}
            />
          </div>
        )}
      </main>

      {/* Rewarded video loading overlay */}
      {adLoading && (
        <div className="modal-backdrop" style={{ zIndex: 2000 }}>
          <div className="glass-panel" style={{ padding: '24px 32px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Tv size={24} color="#34d399" />
            <span style={{ fontWeight: 800, color: '#fff' }}>{t.adLoading}</span>
          </div>
        </div>
      )}

      {diagnostics && (
        <div className="modal-backdrop" style={{ zIndex: 4000 }} onClick={() => setDiagnostics(null)}>
          <pre
            className="glass-panel"
            style={{ width: '92%', maxWidth: '640px', maxHeight: '80vh', overflow: 'auto', padding: '16px', fontSize: '0.72rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', userSelect: 'text' }}
          >
            {diagnostics}
          </pre>
        </div>
      )}

      {/* Short notice toast */}
      {notice && (
        <div
          role="status"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'calc(24px + env(safe-area-inset-bottom))',
            transform: 'translateX(-50%)',
            maxWidth: '90%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #ef4444',
            color: '#fecaca',
            padding: '12px 18px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '0.9rem',
            zIndex: 3000,
            textAlign: 'center',
            whiteSpace: 'pre-line'
          }}
        >
          {notice}
        </div>
      )}

      {/* Modals */}
      {showAudienceModal && (
        <AudienceModal
          votes={audienceVotes}
          currentLanguage={language}
          onClose={() => setShowAudienceModal(false)}
        />
      )}

      {showExpertModal && expertAdvice && (
        <ExpertModal
          advice={expertAdvice}
          currentLanguage={language}
          onClose={() => setShowExpertModal(false)}
        />
      )}

      {activeAd && (
        <UnityAdsModal
          adType={activeAd.type}
          rewardReason={activeAd.reason}
          currentLanguage={language}
          onClose={handleAdClosed}
        />
      )}

      {showUnityDashboard && (
        <UnityDevDashboard
          currentLanguage={language}
          onClose={() => {
            setShowUnityDashboard(false);
            refreshAdStats();
          }}
          onTestAd={(type) => setActiveAd({ type })}
        />
      )}

      {showStatsModal && (
        <StatsModal
          stats={playerStats}
          currentLanguage={language}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {gameState === 'gameover' && (
        <GameOverModal
          wonAmount={finalWonAmount}
          isVictory={isVictory}
          isSafetyRetained={isSafetyRetained}
          canReviveWithAd={canRevive}
          currentLanguage={language}
          onPlayAgain={() => (gameMode === 'daily' ? setGameState('menu') : handleStartGame(gameMode))}
          onBackToMenu={() => setGameState('menu')}
          onWatchAdRevive={handleWatchAdRevive}
        />
      )}
    </div>
  );
}
