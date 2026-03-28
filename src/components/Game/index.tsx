import { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import MetaBoard from './MetaBoard';
import RulesModal from './RulesModal';
import type { AIMode } from '../../lib/types';

export default function Game() {
  const { state, startGame, playMove, resetGame, setAIMode } = useGameState();
  const { currentPlayer, phase, aiMode } = state;
  const [selectedMode, setSelectedMode] = useState<'pvp' | 'ai' | null>(null);
  const [difficulty, setDifficulty] = useState<AIMode>('median');
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const seenRules = localStorage.getItem('ten_rules_seen');
    if (!seenRules) {
      setShowRules(true);
    }
  }, []);

  const handleCloseRules = () => {
    localStorage.setItem('ten_rules_seen', 'true');
    setShowRules(false);
  };

  const handleStart = () => {
    if (selectedMode === 'pvp') {
      setAIMode('none');
    } else if (selectedMode === 'ai') {
      setAIMode(difficulty);
    }
    startGame();
  };

  const isAIThinking = aiMode !== 'none' && currentPlayer === 'o' && state.phase === 'playing';
  const isSetup = phase === 'setup';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">TEN</h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {/* Mode Selection / Info Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {isSetup ? (
            /* Setup Mode - Interactive */
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Mode:</span>
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => setSelectedMode('pvp')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMode === 'pvp'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    2 Player
                  </button>
                  <button
                    onClick={() => setSelectedMode('ai')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMode === 'ai'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    vs AI
                  </button>
                </div>
              </div>

              {selectedMode === 'ai' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">AI:</span>
                  <div className="flex gap-2 flex-1">
                    {(['simple', 'median', 'hard'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          difficulty === d
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={!selectedMode}
                className={`w-full py-2.5 rounded-lg font-medium transition-all text-sm ${
                  selectedMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedMode ? 'Start Game' : 'Select a mode'}
              </button>
            </div>
          ) : (
            /* Playing Mode - Info only */
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Mode:</span>
                <span className="font-medium text-gray-800">
                  {aiMode === 'none' ? '2 Player' : 'vs AI'}
                </span>
              </div>
              {aiMode !== 'none' && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">AI:</span>
                  <span className={`font-medium ${aiMode === 'simple' ? 'text-green-600' : aiMode === 'median' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {aiMode.charAt(0).toUpperCase() + aiMode.slice(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          {state.winner ? (
            <p className={`text-xl font-bold ${state.winner === 'x' ? 'text-red-500' : state.winner === 'o' ? 'text-blue-500' : 'text-gray-500'}`}>
              {state.winner === 'draw' ? "Draw!" : `${state.winner} Wins!`}
            </p>
          ) : isAIThinking ? (
            <p className="text-lg font-medium text-indigo-600">AI thinking...</p>
          ) : isSetup ? (
            <p className="text-gray-500">Select mode to start</p>
          ) : (
            <p className={`text-lg font-bold ${currentPlayer === 'x' ? 'text-red-500' : 'text-blue-500'}`}>
              {currentPlayer.toUpperCase()}'s Turn
            </p>
          )}
        </div>

        {/* Game Board */}
        <div className={isSetup ? 'opacity-50 pointer-events-none' : ''}>
          <MetaBoard state={state} onMove={playMove} />
        </div>

        {/* Rules Modal */}
        {showRules && <RulesModal onClose={handleCloseRules} />}
      </div>
    </div>
  );
}
