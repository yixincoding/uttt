import React from 'react';
import { GameState } from '../types';

interface ScoreBoardProps {
  scores: GameState['scores'];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  return (
    <div className="flex justify-around gap-4">
      <div className="flex flex-col items-center">
        <span className="text-xs text-text-muted uppercase tracking-wide">X Wins</span>
        <span className="text-xl sm:text-2xl font-bold text-primary">{scores.X}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-text-muted uppercase tracking-wide">Draws</span>
        <span className="text-xl sm:text-2xl font-bold text-accent">{scores.draws}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-text-muted uppercase tracking-wide">O Wins</span>
        <span className="text-xl sm:text-2xl font-bold text-secondary">{scores.O}</span>
      </div>
    </div>
  );
};
