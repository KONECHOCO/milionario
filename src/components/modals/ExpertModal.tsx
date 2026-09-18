import React from 'react';
import { PhoneCall, Bot, X } from 'lucide-react';
import type { Language, ExpertAdvice } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';

interface ExpertModalProps {
  advice: ExpertAdvice;
  currentLanguage: Language;
  onClose: () => void;
}

export const ExpertModal: React.FC<ExpertModalProps> = ({
  advice,
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
          border: '2px solid var(--cyan-accent)',
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PhoneCall size={24} color="var(--cyan-accent)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              {t.expertCallTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Expert Profile Card */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px'
          }}
        >
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Bot size={32} />
          </div>
          <div>
            <h4 style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>
              {advice.expertName}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', fontWeight: 600 }}>
              {advice.role}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              Confidence level: <strong style={{ color: '#10b981' }}>{advice.confidence}%</strong>
            </p>
          </div>
        </div>

        {/* Dialogue Bubble */}
        <div 
          style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px dashed var(--cyan-accent)',
            padding: '18px',
            borderRadius: '14px',
            color: '#f1f5f9',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}
        >
          "{advice.dialogue}"
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
              border: 'none',
              color: '#fff',
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
