import React, { useMemo } from 'react';
import { CellValue, SmallBoardStatus } from '../types';
import { Cell } from './Cell';
import { getWinningPattern } from '../utils/gameLogic';

interface SmallBoardProps {
  boardIndex: number;
  cells: CellValue[];
  status: SmallBoardStatus;
  isActive: boolean;
  onCellClick: (cellIndex: number) => void;
  disabled: boolean;
}

export const SmallBoard: React.FC<SmallBoardProps> = ({
  boardIndex,
  cells,
  status,
  isActive,
  onCellClick,
  disabled,
}) => {
  const winningPattern = useMemo(() => {
    if (!status || status === 'DRAW') return null;
    return getWinningPattern(cells);
  }, [cells, status]);

  const winner = status === 'X_WON' ? 'X' : status === 'O_WON' ? 'O' : null;

  return (
    <div
      className={`
        relative
        p-1 sm:p-1.5 md:p-2
        rounded-lg
        transition-all duration-300
        ${isActive && !status ? 'bg-surface-elevated animate-pulse-border' : 'bg-surface'}
        ${status ? 'opacity-80' : ''}
        ${!disabled && isActive && !status ? 'ring-2 ring-accent/50' : ''}
      `}
    >
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {cells.map((cell, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cell}
            onClick={() => onCellClick(cellIndex)}
            disabled={disabled || !!status || !isActive}
            isWinningCell={winningPattern?.includes(cellIndex) || false}
          />
        ))}
      </div>
      
      {winner && (
        <div
          className={`
            absolute inset-0 
            flex items-center justify-center
            bg-black/60
            rounded-lg
            animate-cell-pop
          `}
        >
          <span
            className={`
              text-4xl sm:text-5xl md:text-6xl 
              font-bold 
              ${winner === 'X' ? 'text-primary' : 'text-secondary'}
            `}
          >
            {winner}
          </span>
        </div>
      )}

      {status === 'DRAW' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
          <span className="text-2xl font-bold text-text-muted">Draw</span>
        </div>
      )}

      <div className="absolute -top-1 -left-1 w-3 h-3 bg-surface-elevated rounded-full flex items-center justify-center">
        <span className="text-[8px] font-bold text-text-muted">{boardIndex}</span>
      </div>
    </div>
  );
};
