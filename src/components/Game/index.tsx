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
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Ultimate Tic-Tac-Toe</h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:border-accent transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="text-center">
          {state.winner ? (
            <p className={`text-xl font-bold ${state.winner === 'x' ? 'text-player-x' : state.winner === 'o' ? 'text-player-o' : 'text-gray-500'}`}>
              {state.winner === 'draw' ? "It's a Draw!" : `${state.winner.toUpperCase()} Wins!`}
            </p>
          ) : isAIThinking ? (
            <p className="text-xl font-bold text-accent animate-pulse">AI Thinking...</p>
          ) : (
            <p className={`text-xl font-bold ${currentPlayer === 'x' ? 'text-player-x' : 'text-player-o'}`}>
              {currentPlayer.toUpperCase()}'s Turn
            </p>
          )}
        </div>

        <MetaBoard state={state} onMove={playMove} />
      </div>
    </div>
  );
}
