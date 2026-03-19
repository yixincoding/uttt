import React from 'react';
import { Move } from '../types';

interface MoveHistoryProps {
  moves: Move[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const getBoardLabel = (index: number): string => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `Board ${index} (${row},${col})`;
  };

  const getCellLabel = (index: number): string => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `(${row},${col})`;
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-semibold text-text-primary mb-2 shrink-0">Move History</h3>
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {moves.length === 0 ? (
          <p className="text-xs text-text-muted italic">No moves yet</p>
        ) : (
          moves.map((move, index) => (
            <div
              key={move.timestamp}
              className={`
                text-xs p-1.5 rounded shrink-0
                ${index === moves.length - 1 ? 'bg-accent/10 border border-accent/30' : 'bg-surface'}
              `}
            >
              <span className={move.player === 'X' ? 'text-primary' : 'text-secondary'}>
                {move.player}
              </span>
              <span className="text-text-muted"> at </span>
              <span className="text-text-primary">{getBoardLabel(move.boardIndex)}</span>
              <span className="text-text-muted">, Cell </span>
              <span className="text-text-primary">{getCellLabel(move.cellIndex)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
