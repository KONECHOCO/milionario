import React from 'react';
import { Trophy, Award, Gamepad2, X } from 'lucide-react';
import type { Language, PlayerStats } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';

interface StatsModalProps {
  stats: PlayerStats;
  currentLanguage: Language;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  currentLanguage,
  onClose
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel"
        style={{
          width: '90%',
          maxWidth: '560px',
          padding: '28px',
          borderRadius: '24px',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={26} color="var(--gold-primary)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff' }}>
              {t.statsTitle}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
              <Gamepad2 size={16} />
              <span>{t.gamesPlayed}</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {stats.gamesPlayed}
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Award size={16} />
              <span>{t.totalWinnings}</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-light)', marginTop: '4px' }}>
              {formatCurrency(stats.totalWinnings)}
            </p>
          </div>
        </div>

        {/* Level & Wins Detail */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#cbd5e1' }}>{t.highestLevel}</span>
            <strong style={{ color: 'var(--cyan-accent)' }}>Level {stats.highestLadderLevel}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#cbd5e1' }}>Classic Mode Victories</span>
            <strong style={{ color: '#10b981' }}>{stats.classicWins}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#cbd5e1' }}>Super Milionario Victories</span>
            <strong style={{ color: 'var(--gold-primary)' }}>{stats.superWins}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--gold-gradient)',
              border: 'none',
              color: '#000',
              padding: '10px 32px',
              borderRadius: '20px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
