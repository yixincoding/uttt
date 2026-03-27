import { useGameState } from '../../hooks/useGameState';
import MetaBoard from './MetaBoard';
import { PreGame } from '../PreGame';

export default function Game() {
  const { state, startGame, playMove, resetGame, setAIMode } = useGameState();
  const { currentPlayer } = state;

  if (state.phase === 'setup') {
    return <PreGame onStart={(aiMode) => { setAIMode(aiMode); startGame(); }} />;
  }

  const isAIThinking = state.aiMode !== 'none' && currentPlayer === 'o' && state.phase === 'playing';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">TEN</h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        <div className="text-center">
          {state.winner ? (
            <p className={`text-xl font-bold ${state.winner === 'x' ? 'text-red-500' : state.winner === 'o' ? 'text-blue-500' : 'text-gray-500'}`}>
              {state.winner === 'draw' ? "Draw!" : `${state.winner} Wins!`}
            </p>
          ) : isAIThinking ? (
            <p className="text-lg font-medium text-indigo-600">AI thinking...</p>
          ) : (
            <p className={`text-lg font-bold ${currentPlayer === 'x' ? 'text-red-500' : 'text-blue-500'}`}>
              {currentPlayer.toUpperCase()}'s Turn
            </p>
          )}
        </div>

        <MetaBoard state={state} onMove={playMove} />
      </div>
    </div>
  );
}
