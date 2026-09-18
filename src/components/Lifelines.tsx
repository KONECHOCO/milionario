import React from 'react';
import { Users, PhoneCall, RefreshCw, Tv } from 'lucide-react';
import type { Lifelines as LifelinesType, Language } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface LifelinesProps {
  lifelines: LifelinesType;
  currentLanguage: Language;
  onUseFiftyFifty: () => void;
  onUseAudience: () => void;
  onUseExpert: () => void;
  onUseSwap: () => void;
  onWatchAdExtraLifeline: () => void;
  disabled: boolean;
}

export const Lifelines: React.FC<LifelinesProps> = ({
  lifelines,
  currentLanguage,
  onUseFiftyFifty,
  onUseAudience,
  onUseExpert,
  onUseSwap,
  onWatchAdExtraLifeline,
  disabled
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        margin: '12px 0'
      }}
    >
      {/* 50:50 Lifeline */}
      <button
        onClick={onUseFiftyFifty}
        disabled={disabled || lifelines.fiftyFifty.used}
        className="lifeline-btn"
        title={t.lifelinesFifty}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem' }}>
          50:50
        </span>
      </button>

      {/* Ask Audience Lifeline */}
      <button
        onClick={onUseAudience}
        disabled={disabled || lifelines.audience.used}
        className="lifeline-btn"
        title={t.lifelinesAudience}
      >
        <Users size={22} />
      </button>

      {/* Phone AI Expert Lifeline */}
      <button
        onClick={onUseExpert}
        disabled={disabled || lifelines.expert.used}
        className="lifeline-btn"
        title={t.lifelinesExpert}
      >
        <PhoneCall size={22} />
      </button>

      {/* Swap Question Lifeline */}
      <button
        onClick={onUseSwap}
        disabled={disabled || lifelines.swap.used}
        className="lifeline-btn"
        title={t.lifelinesSwap}
      >
        <RefreshCw size={22} />
      </button>

      {/* Unity Rewarded Ad Extra Lifeline Button */}
      <button
        onClick={onWatchAdExtraLifeline}
        disabled={disabled || lifelines.rewardedExtra.used}
        className="lifeline-btn"
        title={t.watchAdExtraLifeline}
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderColor: '#34d399',
          color: '#ffffff'
        }}
      >
        <Tv size={22} />
      </button>
    </div>
  );
};
