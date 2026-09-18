import React, { useState } from 'react';
import { Tv, DollarSign, Activity, Play, Save, X, Layers } from 'lucide-react';
import type { Language, UnityAdsConfig, AdType } from '../../types';
import { UI_TRANSLATIONS } from '../../i18n/translations';
import { unityAdsService } from '../../services/unityAdsService';

interface UnityDevDashboardProps {
  currentLanguage: Language;
  onClose: () => void;
  onTestAd: (type: AdType) => void;
}

export const UnityDevDashboard: React.FC<UnityDevDashboardProps> = ({
  currentLanguage,
  onClose,
  onTestAd
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];
  const [config, setConfig] = useState<UnityAdsConfig>(unityAdsService.getConfig());
  const [stats] = useState(unityAdsService.getStats());
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  const handleSave = () => {
    unityAdsService.updateConfig(config);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel"
        style={{
          width: '94%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '24px',
          border: '2px solid #818cf8',
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.4)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tv size={28} color="#818cf8" />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff' }}>
                {t.unityDevConfig}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                Unity Cloud Monetization Engine v4.9.0
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700 }}>
              <Activity size={16} />
              <span>{t.unityImpressions}</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
              {stats.totalImpressions}
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
              <DollarSign size={16} />
              <span>{t.unityEarnings}</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
              ${stats.totalEarningsUSD.toFixed(4)}
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Layers size={16} />
              <span>{t.unityEcpm}</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-light)', marginTop: '6px' }}>
              ${config.simulatedEcpm.rewarded.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Configuration Controls */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '14px', fontSize: '1rem' }}>
            Unity Project SDK Keys
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                {t.unityGameId}
              </label>
              <input
                type="text"
                value={config.gameId}
                onChange={(e) => setConfig({ ...config, gameId: e.target.value })}
                style={{
                  width: '100%',
                  background: '#090d26',
                  border: '1px solid #4338ca',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Rewarded Placement ID
              </label>
              <input
                type="text"
                value={config.rewardedPlacementId}
                onChange={(e) => setConfig({ ...config, rewardedPlacementId: e.target.value })}
                style={{
                  width: '100%',
                  background: '#090d26',
                  border: '1px solid #4338ca',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 700
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.testMode}
                onChange={(e) => setConfig({ ...config, testMode: e.target.checked })}
              />
              Enable Test Mode
            </label>

            <button
              onClick={handleSave}
              style={{
                marginLeft: 'auto',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                border: 'none',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={16} />
              <span>Save Config</span>
            </button>
          </div>
          {savedMsg && <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '8px', textAlign: 'right' }}>Configuration updated!</p>}
        </div>

        {/* Test Ad Units */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '12px', fontSize: '1rem' }}>
            Test Unity Ad Placements
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onTestAd('interstitial')}
              style={{
                background: 'rgba(51, 65, 85, 0.8)',
                border: '1px solid #64748b',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Play size={16} />
              <span>{t.testInterstitial}</span>
            </button>

            <button
              onClick={() => onTestAd('rewarded')}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: '1px solid #34d399',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Play size={16} />
              <span>{t.testRewarded}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
