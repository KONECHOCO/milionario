import React from 'react';
import type { Question, Language } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentLanguage: Language;
  selectedOption: number | null; // 0, 1, 2, 3 or null
  disabledOptions: number[]; // e.g. [0, 2] removed by 50:50
  answerState: 'idle' | 'selected' | 'locked' | 'correct' | 'wrong';
  onSelectOption: (optionIndex: number) => void;
  onConfirmAnswer: () => void;
}

const OPTION_PREFIXES = ['A', 'B', 'C', 'D'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentLanguage,
  selectedOption,
  disabledOptions,
  answerState,
  onSelectOption,
  onConfirmAnswer
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];
  const qText = question.question[currentLanguage] || question.question.it;
  const optionsText = question.options[currentLanguage] || question.options.it;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '850px'
      }}
    >
      {/* Question Category & Level Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px'
        }}
      >
        <span 
          style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid var(--cyan-accent)',
            color: 'var(--cyan-accent)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          {t.category}: {question.category}
        </span>
        <span style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.9rem' }}>
          {t.questionTitle} {question.level}
        </span>
      </div>

      {/* Main Question Box */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px 28px',
          textAlign: 'center',
          minHeight: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--card-border)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(245, 158, 11, 0.08)',
          borderRadius: '20px'
        }}
      >
        <h2 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
          }}
        >
          {qText}
        </h2>
      </div>

      {/* Options Grid (2x2) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px'
        }}
      >
        {optionsText.map((optionText, idx) => {
          const isDisabled = disabledOptions.includes(idx);
          const isSelected = selectedOption === idx;
          let optionClass = 'option-hexagon';

          if (isDisabled) {
            optionClass += ' disabled';
          } else if (isSelected) {
            if (answerState === 'correct') optionClass += ' correct';
            else if (answerState === 'wrong') optionClass += ' wrong';
            else optionClass += ' selected';
          } else if (answerState === 'correct' && idx === question.correctAnswer) {
            // Flash correct answer if player picked wrong
            optionClass += ' correct';
          }

          return (
            <button
              key={idx}
              disabled={isDisabled || answerState === 'locked' || answerState === 'correct' || answerState === 'wrong'}
              onClick={() => onSelectOption(idx)}
              className={optionClass}
            >
              <span className="option-prefix">{OPTION_PREFIXES[idx]}:</span>
              <span style={{ flex: 1, textAlign: 'left', wordBreak: 'break-word' }}>
                {isDisabled ? '' : optionText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirm Final Answer Action Bar */}
      {selectedOption !== null && answerState === 'selected' && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '12px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <button
            onClick={onConfirmAnswer}
            style={{
              background: 'var(--gold-gradient)',
              border: '2px solid #fff',
              color: '#000',
              padding: '14px 40px',
              borderRadius: '30px',
              fontSize: '1.15rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={22} />
            <span>{t.lockAnswer} ({OPTION_PREFIXES[selectedOption]})</span>
          </button>
        </div>
      )}

      {/* Explanation Box (when answer revealed) */}
      {(answerState === 'correct' || answerState === 'wrong') && question.explanation && (
        <div 
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            marginTop: '12px',
            border: '1px solid var(--cyan-accent)',
            background: 'rgba(6, 182, 212, 0.08)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <HelpCircle size={20} color="var(--cyan-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--cyan-accent)' }}>{t.explanation}: </strong>
            {question.explanation[currentLanguage] || question.explanation.it}
          </p>
        </div>
      )}
    </div>
  );
};
