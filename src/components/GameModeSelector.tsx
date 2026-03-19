import React from 'react';
import { GameMode, AIDifficulty } from '../types';

interface GameModeSelectorProps {
  gameMode: GameMode;
  userPlaysFirst: boolean;
  aiDifficulty: AIDifficulty;
  onModeChange: (mode: GameMode) => void;
  onFirstMoveChange: (playsFirst: boolean) => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  disabled?: boolean;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  gameMode,
  userPlaysFirst,
  aiDifficulty,
  onModeChange,
  onFirstMoveChange,
  onDifficultyChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-muted">Game Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('PvP')}
            disabled={disabled}
            className={`
              flex-1 px-3 py-1.5
              text-xs sm:text-sm
              rounded-lg
              transition-all duration-200
              ${gameMode === 'PvP'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface text-text-muted hover:bg-surface-elevated'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            2 Players
          </button>
          <button
            onClick={() => onModeChange('PvAI')}
            disabled={disabled}
            className={`
              flex-1 px-3 py-1.5
              text-xs sm:text-sm
              rounded-lg
              transition-all duration-200
              ${gameMode === 'PvAI'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface text-text-muted hover:bg-surface-elevated'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            vs AI
          </button>
        </div>
      </div>

      {gameMode === 'PvAI' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">First Move</label>
            <div className="flex gap-2">
              <button
                onClick={() => onFirstMoveChange(true)}
                className={`
                  flex-1 px-3 py-1.5
                  text-xs sm:text-sm
                  rounded-lg
                  transition-all duration-200
                  ${userPlaysFirst
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-surface text-text-muted hover:bg-surface-elevated'
                  }
                `}
              >
                You (X)
              </button>
              <button
                onClick={() => onFirstMoveChange(false)}
                className={`
                  flex-1 px-3 py-1.5
                  text-xs sm:text-sm
                  rounded-lg
                  transition-all duration-200
                  ${!userPlaysFirst
                    ? 'bg-secondary/20 text-secondary border border-secondary/50'
                    : 'bg-surface text-text-muted hover:bg-surface-elevated'
                  }
                `}
              >
                AI (O)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">Difficulty</label>
            <div className="flex gap-1">
              {(['simple', 'median', 'hard'] as AIDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  className={`
                    flex-1 px-2 py-1.5
                    text-xs sm:text-sm
                    rounded-lg
                    capitalize
                    transition-all duration-200
                    ${aiDifficulty === diff
                      ? 'bg-accent text-background font-semibold'
                      : 'bg-surface text-text-muted hover:bg-surface-elevated'
                    }
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
