import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Tv, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';

interface GameOverModalProps {
  wonAmount: number;
  isVictory: boolean;
  isSafetyRetained: boolean;
  canReviveWithAd: boolean;
  currentLanguage: Language;
  onPlayAgain: () => void;
  onWatchAdRevive: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  wonAmount,
  isVictory,
  isSafetyRetained,
  canReviveWithAd,
  currentLanguage,
  onPlayAgain,
  onWatchAdRevive
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  useEffect(() => {
    if (isVictory) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isVictory]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel"
        style={{
          width: '90%',
          maxWidth: '540px',
          padding: '36px 28px',
          borderRadius: '24px',
          textAlign: 'center',
          border: isVictory ? '3px solid var(--gold-primary)' : '2px solid #334155',
          boxShadow: isVictory ? '0 0 60px rgba(245, 158, 11, 0.6)' : '0 10px 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Header Badge Icon */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isVictory ? 'var(--gold-gradient)' : 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
            margin: '0 auto 20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isVictory ? '#000' : '#cbd5e1',
            boxShadow: isVictory ? '0 0 30px rgba(245, 158, 11, 0.8)' : 'none'
          }}
        >
          {isVictory ? <Trophy size={42} /> : <AlertTriangle size={40} color="#ef4444" />}
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>
          {isVictory ? t.congratulations : t.gameOver}
        </h2>

        <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '20px' }}>
          {isVictory ? t.youWon : isSafetyRetained ? t.safetyRetained : t.wonZero}
        </p>

        {/* Large Prize Display */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '2px solid var(--gold-primary)',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '28px',
            boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.15)'
          }}
        >
          <span 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'var(--gold-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {formatCurrency(wonAmount)}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {canReviveWithAd && !isVictory && (
            <button
              onClick={onWatchAdRevive}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: '2px solid #34d399',
                color: '#fff',
                padding: '14px 24px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
              }}
            >
              <Tv size={22} />
              <span>{t.watchAdRevive}</span>
            </button>
          )}

          <button
            onClick={onPlayAgain}
            style={{
              background: 'var(--gold-gradient)',
              border: 'none',
              color: '#000',
              padding: '14px 24px',
              borderRadius: '14px',
              fontWeight: 900,
              fontSize: '1.05rem',
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)'
            }}
          >
            <RotateCcw size={20} />
            <span>{t.playAgain}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
