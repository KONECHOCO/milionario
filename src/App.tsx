import { useState, useEffect } from 'react';
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
  CLASSIC_PRIZE_LADDER, 
  SUPER_PRIZE_LADDER, 
  SAFETY_CHECKPOINTS_CLASSIC, 
  SAFETY_CHECKPOINTS_SUPER,
  getRandomQuestionForLevel
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

import { Play, Zap, LogOut, Tv } from 'lucide-react';

const DEFAULT_LIFELINES: LifelinesType = {
  fiftyFifty: { used: false, active: true },
  audience: { used: false, active: true },
  expert: { used: false, active: true },
  swap: { used: false, active: true },
  rewardedExtra: { used: false, active: true }
};

const STATS_STORAGE_KEY = 'milionario_player_stats';

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

export default function App() {
  const [language, setLanguage] = useState<Language>('it');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [answerState, setAnswerState] = useState<'idle' | 'selected' | 'locked' | 'correct' | 'wrong'>('idle');

  const [lifelines, setLifelines] = useState<LifelinesType>(DEFAULT_LIFELINES);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // Modals state
  const [showAudienceModal, setShowAudienceModal] = useState<boolean>(false);
  const [audienceVotes, setAudienceVotes] = useState<AudienceVote[]>([]);

  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [expertAdvice, setExpertAdvice] = useState<ExpertAdvice | null>(null);

  const [activeAd, setActiveAd] = useState<{ type: AdType; reason?: string } | null>(null);
  const [showUnityDashboard, setShowUnityDashboard] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  // GameOver state
  const [finalWonAmount, setFinalWonAmount] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isSafetyRetained, setIsSafetyRetained] = useState<boolean>(false);
  const [canRevive, setCanRevive] = useState<boolean>(true);

  // Player Stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PLAYER_STATS;
  });

  const [unityStats, setUnityStats] = useState(unityAdsService.getStats());

  const t = UI_TRANSLATIONS[language];
  const prizeLadder = gameMode === 'super' ? SUPER_PRIZE_LADDER : CLASSIC_PRIZE_LADDER;
  const safetyCheckpoints = gameMode === 'super' ? SAFETY_CHECKPOINTS_SUPER : SAFETY_CHECKPOINTS_CLASSIC;

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(playerStats));
  }, [playerStats]);

  const refreshAdStats = () => {
    setUnityStats(unityAdsService.getStats());
  };

  const handleToggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Helper to load a randomized question for a level
  const loadRandomQuestion = (levelNumber: number, usedSet: Set<string>) => {
    const q = getRandomQuestionForLevel(levelNumber, usedSet);
    setCurrentQuestion(q);
    const newSet = new Set(usedSet);
    newSet.add(q.id);
    setUsedQuestionIds(newSet);
    return newSet;
  };

  // Start new game
  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('playing');
    setCurrentLevelIndex(0);
    setSelectedOption(null);
    setDisabledOptions([]);
    setAnswerState('idle');
    setLifelines(DEFAULT_LIFELINES);
    setCanRevive(true);

    const emptySet = new Set<string>();
    loadRandomQuestion(1, emptySet);

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

  // Confirm Answer
  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setAnswerState('locked');
    audioEngine.playLock();

    // Reveal after 1.8 seconds suspense delay
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
          }
        }, 2200);

      } else {
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

        setTimeout(() => {
          handleEndGame(safetyPrize, false, retained);
        }, 2200);
      }
    }, 1800);
  };

  // End game summary
  const handleEndGame = (won: number, victory: boolean, safetyRetained: boolean) => {
    audioEngine.stopTensionBGM();
    setFinalWonAmount(won);
    setIsVictory(victory);
    setIsSafetyRetained(safetyRetained);
    setGameState('gameover');

    if (victory) {
      audioEngine.playVictory();
    }

    setPlayerStats((prev) => ({
      ...prev,
      totalWinnings: prev.totalWinnings + won,
      classicWins: victory && gameMode === 'classic' ? prev.classicWins + 1 : prev.classicWins,
      superWins: victory && gameMode === 'super' ? prev.superWins + 1 : prev.superWins
    }));

    // Trigger Interstitial Ad automatically based on frequency setting
    const config = unityAdsService.getConfig();
    if (playerStats.gamesPlayed % config.autoInterstitialFrequency === 0) {
      setTimeout(() => {
        setActiveAd({ type: 'interstitial' });
      }, 1000);
    }
  };

  // Walk Away with cash
  const handleWalkAway = () => {
    const cashOutAmount = currentLevelIndex > 0 ? prizeLadder[currentLevelIndex - 1] : 0;
    handleEndGame(cashOutAmount, false, false);
  };

  // Lifeline 1: 50:50
  const handleUseFiftyFifty = () => {
    if (lifelines.fiftyFifty.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();

    const correct = currentQuestion.correctAnswer;
    const wrongOptions = [0, 1, 2, 3].filter((idx) => idx !== correct);
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
    const toDisable = [shuffled[0], shuffled[1]];

    setDisabledOptions(toDisable);
    setLifelines((prev) => ({
      ...prev,
      fiftyFifty: { used: true, active: false }
    }));
  };

  // Lifeline 2: Ask Audience
  const handleUseAudience = () => {
    if (lifelines.audience.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();

    const correct = currentQuestion.correctAnswer;
    let votes: AudienceVote[] = [];

    const correctPct = Math.floor(Math.random() * 30) + 50; // 50-80%
    const remainingPct = 100 - correctPct;

    const wrongPct1 = Math.floor(Math.random() * (remainingPct - 5));
    const wrongPct2 = Math.floor(Math.random() * (remainingPct - wrongPct1));
    const wrongPct3 = remainingPct - wrongPct1 - wrongPct2;

    const wrongPcts = [wrongPct1, wrongPct2, wrongPct3];
    let wrongIdx = 0;

    for (let i = 0; i < 4; i++) {
      if (i === correct) {
        votes.push({ option: i, percentage: correctPct });
      } else {
        votes.push({ option: i, percentage: wrongPcts[wrongIdx++] || 0 });
      }
    }

    setAudienceVotes(votes);
    setShowAudienceModal(true);
    setLifelines((prev) => ({
      ...prev,
      audience: { used: true, active: false }
    }));
  };

  // Lifeline 3: AI Expert Call
  const handleUseExpert = () => {
    if (lifelines.expert.used || answerState !== 'idle' || !currentQuestion) return;
    audioEngine.playLifeline();

    const optionsText = currentQuestion.options[language] || currentQuestion.options.it;
    const correctIdx = currentQuestion.correctAnswer;
    const correctText = optionsText[correctIdx];

    const advice: ExpertAdvice = {
      expertName: 'Prof. Sofia Moretti',
      role: 'Head of General Knowledge Academy',
      avatar: 'expert_1',
      confidence: 85,
      suggestedAnswer: correctIdx,
      dialogue: `I'm quite confident about this one! Based on my research in ${currentQuestion.category}, option (${['A','B','C','D'][correctIdx]}: "${correctText}") is definitely the correct answer.`
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

    loadRandomQuestion(currentLevelIndex + 1, usedQuestionIds);
    setSelectedOption(null);
    setDisabledOptions([]);

    setLifelines((prev) => ({
      ...prev,
      swap: { used: true, active: false }
    }));
  };

  // Lifeline 5: Unity Rewarded Ad Extra Lifeline
  const handleWatchAdExtraLifeline = () => {
    setActiveAd({ type: 'rewarded', reason: 'Extra Lifeline Unlock' });
  };

  // Unity Ad Revive
  const handleWatchAdRevive = () => {
    setActiveAd({ type: 'rewarded', reason: 'Game Revive / Second Chance' });
  };

  const handleAdClosed = (rewardGranted: boolean) => {
    refreshAdStats();

    if (rewardGranted && activeAd) {
      if (activeAd.reason === 'Extra Lifeline Unlock') {
        setLifelines((prev) => ({
          ...prev,
          fiftyFifty: { used: false, active: true },
          rewardedExtra: { used: true, active: false }
        }));
      } else if (activeAd.reason === 'Game Revive / Second Chance') {
        setGameState('playing');
        setAnswerState('idle');
        setSelectedOption(null);
        setDisabledOptions([]);
        setCanRevive(false);
        audioEngine.startTensionBGM();
      }
    }
    setActiveAd(null);
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
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 36px auto' }}>
                {t.classicDesc}
              </p>

              {/* Game Mode Selection Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <button
                  onClick={() => handleStartGame('classic')}
                  style={{
                    background: 'var(--gold-gradient)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '24px',
                    color: '#000',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
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
                    15 Questions • 2 Checkpoints • €1.000.000
                  </p>
                </button>

                <button
                  onClick={() => handleStartGame('super')}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '24px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
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
                    25 Questions • Ultimate Prize €5.000.000
                  </p>
                </button>
              </div>
            </div>

            {/* Active Unity Banner Ad Display */}
            <div 
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
            </div>
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
            <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Lifelines
                lifelines={lifelines}
                currentLanguage={language}
                onUseFiftyFifty={handleUseFiftyFifty}
                onUseAudience={handleUseAudience}
                onUseExpert={handleUseExpert}
                onUseSwap={handleUseSwap}
                onWatchAdExtraLifeline={handleWatchAdExtraLifeline}
                disabled={answerState === 'locked' || answerState === 'correct' || answerState === 'wrong'}
              />

              <QuestionCard
                question={currentQuestion}
                currentLanguage={language}
                selectedOption={selectedOption}
                disabledOptions={disabledOptions}
                answerState={answerState}
                onSelectOption={handleSelectOption}
                onConfirmAnswer={handleConfirmAnswer}
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
            />
          </div>
        )}
      </main>

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
          onPlayAgain={() => handleStartGame(gameMode)}
          onWatchAdRevive={handleWatchAdRevive}
        />
      )}
    </div>
  );
}
