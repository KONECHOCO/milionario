import React from 'react';

export const StudioBackground: React.FC = () => {
  return (
    <div className="studio-background">
      <div className="spotlight-beam spotlight-beam-left" />
      <div className="spotlight-beam spotlight-beam-right" />
      {/* Dynamic floor glowing ring */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '40vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, rgba(245, 158, 11, 0.05) 40%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
