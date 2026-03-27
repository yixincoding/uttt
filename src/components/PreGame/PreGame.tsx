import { useState } from 'react';
import type { AIMode } from '../../lib/types';

interface PreGameProps {
  onStart: (aiMode: AIMode) => void;
}

export function PreGame({ onStart }: PreGameProps) {
  const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);
  const [difficulty, setDifficulty] = useState<AIMode>('median');

  const handleStart = () => {
    if (gameMode === 'pvp') {
      onStart('none');
    } else if (gameMode === 'ai') {
      onStart(difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-1">TEN</h1>
          <p className="text-gray-500 text-sm">Ultimate Tic-Tac-Toe</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-3 font-medium">Game Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setGameMode('pvp')}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  gameMode === 'pvp'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                2 Player
              </button>
              <button
                onClick={() => setGameMode('ai')}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  gameMode === 'ai'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                vs AI
              </button>
            </div>
          </div>

          {gameMode === 'ai' && (
            <div>
              <p className="text-sm text-gray-500 mb-3 font-medium">Difficulty</p>
              <div className="flex gap-2">
                {(['simple', 'median', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameMode && (
            <div className="pt-4">
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Start
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
