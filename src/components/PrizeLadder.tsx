import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

interface PrizeLadderProps {
  prizeLadder: number[];
  currentLevelIndex: number; // 0-based
  safetyCheckpoints: number[]; // e.g. [5, 10] (1-based levels 5 and 10)
}

export const PrizeLadder: React.FC<PrizeLadderProps> = ({
  prizeLadder,
  currentLevelIndex,
  safetyCheckpoints
}) => {
  // Ladder is usually displayed top-to-bottom (highest prize at top)
  const reversedLadder = [...prizeLadder].map((amount, originalIdx) => ({
    amount,
    levelNumber: originalIdx + 1,
    isSafety: safetyCheckpoints.includes(originalIdx + 1),
    isCurrent: originalIdx === currentLevelIndex,
    isPassed: originalIdx < currentLevelIndex
  })).reverse();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '16px',
        width: '280px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--card-border)'
        }}
      >
        <Award size={20} color="var(--gold-primary)" />
        <span 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 700, 
            fontSize: '0.95rem',
            color: 'var(--gold-light)'
          }}
        >
          MONTEPREMI
        </span>
      </div>

      {reversedLadder.map((item) => {
        let itemClass = 'ladder-item';
        if (item.isCurrent) itemClass += ' active';
        else if (item.isPassed) itemClass += ' passed';
        else if (item.isSafety) itemClass += ' safety';

        return (
          <div key={item.levelNumber} className={itemClass}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8, width: '22px' }}>
                {item.levelNumber}
              </span>
              {item.isSafety && (
                <ShieldCheck size={14} color={item.isCurrent ? '#000' : 'var(--cyan-accent)'} />
              )}
            </div>
            <span>{formatCurrency(item.amount)}</span>
          </div>
        );
      })}
    </div>
  );
};
