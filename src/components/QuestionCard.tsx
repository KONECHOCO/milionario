import React from 'react';
import type { Question, Language } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { CheckCircle2, HelpCircle, Timer } from 'lucide-react';
import { categoryLabel } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  currentLanguage: Language;
  selectedOption: number | null; // 0, 1, 2, 3 or null
  disabledOptions: number[]; // e.g. [0, 2] removed by 50:50
  answerState: 'idle' | 'selected' | 'locked' | 'correct' | 'wrong';
  onSelectOption: (optionIndex: number) => void;
  onConfirmAnswer: () => void;
  timeLeft?: number | null; // seconds left in timed modes
  timeLimit?: number;
  timedOut?: boolean;
}

const OPTION_PREFIXES = ['A', 'B', 'C', 'D'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentLanguage,
  selectedOption,
  disabledOptions,
  answerState,
  onSelectOption,
  onConfirmAnswer,
  timeLeft = null,
  timeLimit = 0,
  timedOut = false
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
          {categoryLabel(question.category, currentLanguage)}
        </span>
        <span style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.9rem' }}>
          {t.questionTitle} {question.level}
        </span>
      </div>

      {/* Countdown (Lightning round / Daily challenge) */}
      {timeLeft !== null && timeLimit > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Timer size={20} color={timeLeft <= 5 ? '#ef4444' : 'var(--gold-primary)'} />
          <div style={{ flex: 1, height: '10px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <div
              style={{
                width: `${(timeLeft / timeLimit) * 100}%`,
                height: '100%',
                background: timeLeft <= 5 ? '#ef4444' : 'var(--gold-gradient)',
                transition: 'width 1s linear'
              }}
            />
          </div>
          <span style={{ fontWeight: 900, minWidth: '32px', textAlign: 'right', color: timeLeft <= 5 ? '#fca5a5' : '#fff' }}>
            {timeLeft}s
          </span>
        </div>
      )}

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))',
          gap: '16px'
        }}
      >
        {optionsText.map((optionText, idx) => {
          const isRevealed = (answerState === 'correct' || answerState === 'wrong') && idx === question.correctAnswer;
          const isDisabled = disabledOptions.includes(idx) && !isRevealed;
          const isSelected = selectedOption === idx;
          let optionClass = 'option-hexagon';

          if (isDisabled) {
            optionClass += ' disabled';
          } else if (isSelected) {
            if (answerState === 'correct') optionClass += ' correct';
            else if (answerState === 'wrong') optionClass += ' wrong';
            else optionClass += ' selected';
          } else if (answerState === 'wrong' && idx === question.correctAnswer) {
            // Player picked wrong (or ran out of time): reveal the right answer
            optionClass += ' correct reveal';
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

      {/* Wrong answer / time out: spell out the right answer */}
      {answerState === 'wrong' && (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 800,
            color: '#a7f3d0',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {timedOut && <div style={{ color: '#fca5a5', marginBottom: '4px' }}>{t.timeUp}</div>}
          {t.correctAnswerWas}: {OPTION_PREFIXES[question.correctAnswer]} – {optionsText[question.correctAnswer]}
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
