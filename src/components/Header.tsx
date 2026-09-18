import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Volume2, VolumeX, Globe, Trophy, Tv } from 'lucide-react';
import type { Language } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenUnityDashboard: () => void;
  unityImpressionsCount: number;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isMuted,
  onToggleSound,
  onOpenStats,
  onOpenUnityDashboard,
  unityImpressionsCount
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <header 
      className="glass-panel"
      style={{
        margin: '12px auto',
        maxWidth: '1200px',
        width: '94%',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        position: 'relative'
      }}
    >
      {/* Title & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--gold-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 900,
            fontSize: '1.4rem',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)'
          }}
        >
          €
        </div>
        <div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 900,
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #fff 0%, var(--gold-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t.appTitle}
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={18} color="var(--gold-primary)" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--card-border)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ background: '#09122a', color: '#fff' }}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Unity Ads Dev Dashboard Button (web preview only) */}
        {!Capacitor.isNativePlatform() && <button
          onClick={onOpenUnityDashboard}
          title={t.unityAdsManager}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            border: '1px solid #818cf8',
            color: '#fff',
            padding: '7px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 12px rgba(79, 70, 229, 0.4)'
          }}
        >
          <Tv size={16} />
          <span>Unity Ads</span>
          <span
            style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '10px',
              padding: '1px 7px',
              fontSize: '0.7rem',
              fontWeight: 900
            }}
          >
            {unityImpressionsCount}
          </span>
        </button>}

        {/* Stats Button */}
        <button
          onClick={onOpenStats}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--card-border)',
            color: 'var(--gold-primary)',
            padding: '7px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600
          }}
        >
          <Trophy size={18} />
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={onToggleSound}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--card-border)',
            color: isMuted ? '#ef4444' : '#10b981',
            padding: '7px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </header>
  );
};
