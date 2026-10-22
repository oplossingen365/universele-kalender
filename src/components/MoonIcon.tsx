import React from 'react';
import { MoonPhaseName } from '../types/calendar';

interface MoonIconProps {
  phase: MoonPhaseName;
  fraction: number;
  size?: number;
  className?: string;
}

export const MoonIcon: React.FC<MoonIconProps> = ({ phase, fraction, size = 18, className = '' }) => {
  // Simple clean SVG rendering based on illumination
  let fillColor = '#cbd5e1';
  let badgeChar = '🌑';

  switch (phase) {
    case 'new_moon':
      badgeChar = '🌑';
      fillColor = '#475569';
      break;
    case 'waxing_crescent':
      badgeChar = '🌒';
      fillColor = '#94a3b8';
      break;
    case 'first_quarter':
      badgeChar = '🌓';
      fillColor = '#cbd5e1';
      break;
    case 'waxing_gibbous':
      badgeChar = '🌔';
      fillColor = '#f1f5f9';
      break;
    case 'full_moon':
      badgeChar = '🌕';
      fillColor = '#fef08a'; // glowing soft yellow
      break;
    case 'waning_gibbous':
      badgeChar = '🌖';
      fillColor = '#f1f5f9';
      break;
    case 'last_quarter':
      badgeChar = '🌗';
      fillColor = '#cbd5e1';
      break;
    case 'waning_crescent':
      badgeChar = '🌘';
      fillColor = '#94a3b8';
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-normal ${className}`}
      title={`${Math.round(fraction * 100)}% verlicht`}
      style={{ fontSize: `${size}px`, lineHeight: 1, color: fillColor }}
    >
      {badgeChar}
    </span>
  );
};
