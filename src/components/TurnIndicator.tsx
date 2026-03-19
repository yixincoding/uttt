import React from 'react';
import { Player } from '../types';

interface TurnIndicatorProps {
  currentPlayer: Player;
  isAIThinking: boolean;
  winner: Player | 'DRAW' | null;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentPlayer,
  isAIThinking,
  winner,
}) => {
  if (winner) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-lg sm:text-xl font-semibold text-accent">
          {winner === 'DRAW' ? "It's a Draw!" : `Player ${winner} Wins!`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          w-8 h-8 sm:w-10 sm:h-10
          rounded-full
          flex items-center justify-center
          text-xl sm:text-2xl font-bold
          transition-all duration-300
          ${currentPlayer === 'X' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}
        `}
      >
        {currentPlayer}
      </div>
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-medium text-text-primary">
          {isAIThinking ? 'AI is thinking...' : `Player ${currentPlayer}'s turn`}
        </span>
        {isAIThinking && (
          <span className="text-xs text-text-muted">Calculating best move...</span>
        )}
      </div>
    </div>
  );
};
