import React, { useState, useEffect } from 'react';
import { Tv, PlayCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { Language, AdType } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';
import { unityAdsService } from '../../services/unityAdsService';

interface UnityAdsModalProps {
  adType: AdType;
  rewardReason?: string;
  currentLanguage: Language;
  onClose: (rewardGranted: boolean) => void;
}

export const UnityAdsModal: React.FC<UnityAdsModalProps> = ({
  adType,
  rewardReason,
  currentLanguage,
  onClose
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];
  const [countdown, setCountdown] = useState<number>(adType === 'rewarded' ? 5 : 3);
  const [completed, setCompleted] = useState<boolean>(false);
  const config = unityAdsService.getConfig();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
      unityAdsService.completeAd(true, rewardReason);
    }
  }, [countdown, rewardReason]);

  const handleFinish = () => {
    onClose(true);
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel"
        style={{
          width: '92%',
          maxWidth: '640px',
          background: '#04091e',
          borderRadius: '24px',
          border: '2px solid #6366f1',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Unity Ads Header Bar */}
        <div 
          style={{
            background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #4338ca'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tv size={22} color="#818cf8" />
            <div>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: '0.95rem' }}>
                UNITY CLOUD ADS
              </span>
              <span style={{ fontSize: '0.7rem', color: '#a5b4fc', marginLeft: '8px' }}>
                ID: {config.gameId} ({config.testMode ? 'TEST MODE' : 'PRODUCTION'})
              </span>
            </div>
          </div>
          <span 
            style={{ 
              background: '#4338ca', 
              color: '#e0e7ff', 
              fontSize: '0.75rem', 
              padding: '3px 10px', 
              borderRadius: '12px',
              fontWeight: 700 
            }}
          >
            {adType.toUpperCase()}
          </span>
        </div>

        {/* Video Simulation Body */}
        <div 
          style={{
            position: 'relative',
            height: '280px',
            background: 'radial-gradient(circle at center, #1e1b4b 0%, #030712 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          {/* Animated Unity Cube Icon */}
          <div 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.8)',
              animation: 'pulseGold 1.5s infinite alternate'
            }}
          >
            <PlayCircle size={48} color="#fff" />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            {t.adPlaying}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {t.adSponsored}
          </p>

          {/* Progress Bar */}
          <div 
            style={{
              width: '80%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              marginTop: '24px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                height: '100%',
                width: completed ? '100%' : `${((5 - countdown) / 5) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                transition: 'width 1s linear'
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div 
          style={{
            padding: '16px 20px',
            background: '#090d26',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b'
          }}
        >
          {!completed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
              <ShieldAlert size={16} />
              <span>{t.skipIn} {countdown} {t.seconds}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={20} />
              <span>{t.rewardEarned}</span>
            </div>
          )}

          <button
            onClick={handleFinish}
            disabled={!completed}
            style={{
              background: completed ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#334155',
              color: completed ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              cursor: completed ? 'pointer' : 'not-allowed',
              boxShadow: completed ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
            }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
