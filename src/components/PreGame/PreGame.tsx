import { useState } from 'react';
import type { AIMode } from '../../lib/types';

interface PreGameProps {
  onStart: (aiMode: AIMode) => void;
}

type GameMode = 'pvp' | 'ai';

const difficulties: { value: AIMode; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'median', label: 'Median' },
  { value: 'hard', label: 'Hard' },
];

export function PreGame({ onStart }: PreGameProps) {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [aiDifficulty, setAiDifficulty] = useState<AIMode>('median');

  const handleStart = () => {
    if (gameMode === 'pvp') {
      onStart('none');
    } else if (gameMode === 'ai') {
      onStart(aiDifficulty);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-surface to-bg-dark border border-border rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent mb-2">
            TEN
          </h1>
          <p className="text-text-secondary">Ultimate Tic-Tac-Toe</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Game Mode
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setGameMode('pvp')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  gameMode === 'pvp'
                    ? 'bg-gradient-to-r from-accent to-accent-secondary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-accent'
                }`}
              >
                Player vs Player
              </button>
              <button
                onClick={() => setGameMode('ai')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  gameMode === 'ai'
                    ? 'bg-gradient-to-r from-accent to-accent-secondary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-accent'
                }`}
              >
                Player vs AI
              </button>
            </div>
          </div>

          {gameMode === 'ai' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Difficulty
              </label>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setAiDifficulty(diff.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      aiDifficulty === diff.value
                        ? 'bg-gradient-to-r from-accent to-accent-secondary text-white'
                        : 'bg-surface border border-border text-text-secondary hover:border-accent'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameMode && (
            <div className="pt-4 space-y-4">
              <div className="text-center text-text-secondary text-sm">
                {gameMode === 'pvp'
                  ? 'Two players will compete'
                  : `You will play against ${aiDifficulty} AI`}
              </div>
              <button
                onClick={handleStart}
                className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-accent to-accent-secondary text-white hover:opacity-90 transition-opacity"
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
