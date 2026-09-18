import React from 'react';
import { Users, X } from 'lucide-react';
import type { Language, AudienceVote } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';

interface AudienceModalProps {
  votes: AudienceVote[];
  currentLanguage: Language;
  onClose: () => void;
}

const PREFIXES = ['A', 'B', 'C', 'D'];

export const AudienceModal: React.FC<AudienceModalProps> = ({
  votes,
  currentLanguage,
  onClose
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel"
        style={{
          width: '90%',
          maxWidth: '520px',
          padding: '28px',
          borderRadius: '20px',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--gold-primary)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff' }}>
              {t.askAudienceTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
          {t.audienceDesc}
        </p>

        {/* Animated Vote Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {votes.map((v, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, color: 'var(--gold-primary)', width: '24px' }}>
                {PREFIXES[idx]}
              </span>
              <div 
                style={{
                  flex: 1,
                  height: '26px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '13px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    height: '100%',
                    width: `${v.percentage}%`,
                    background: 'linear-gradient(90deg, #3b82f6 0%, var(--gold-primary) 100%)',
                    borderRadius: '13px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
              <span style={{ fontWeight: 700, width: '45px', textAlign: 'right', color: '#fff' }}>
                {v.percentage}%
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--gold-gradient)',
              border: 'none',
              color: '#000',
              padding: '10px 30px',
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
