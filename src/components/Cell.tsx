import React from 'react';
import { CellValue } from '../types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinningCell: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, onClick, disabled, isWinningCell }) => {
  const isEmpty = value === null;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || !isEmpty}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
        flex items-center justify-center
        rounded
        transition-all duration-150
        ${isEmpty && !disabled ? 'hover:scale-105 cursor-pointer' : ''}
        ${disabled || !isEmpty ? 'cursor-not-allowed' : ''}
        ${isWinningCell ? 'animate-win-glow' : ''}
        ${value === 'X' ? 'text-primary' : value === 'O' ? 'text-secondary' : 'text-text-muted'}
        bg-surface
        border border-surface-elevated
        focus:outline-none focus:ring-2 focus:ring-accent/50
      `}
    >
      {value && (
        <span className={`text-2xl sm:text-3xl md:text-4xl font-bold animate-cell-pop`}>
          {value}
        </span>
      )}
    </button>
  );
};
