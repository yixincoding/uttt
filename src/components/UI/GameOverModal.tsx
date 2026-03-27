import type { Player } from '../../lib/types';

interface GameOverModalProps {
  winner: Player | 'draw' | null;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

export default function GameOverModal({ winner, onPlayAgain, onChangeMode }: GameOverModalProps) {
  const getWinnerText = () => {
    if (winner === 'draw') return 'DRAW';
    if (winner === 'x') return 'X WINS';
    if (winner === 'o') return 'O WINS';
    return '';
  };

  const getWinnerColorClass = () => {
    if (winner === 'x') return 'text-player-x';
    if (winner === 'o') return 'text-player-o';
    return 'text-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full text-center">
        <h2 className={`text-4xl font-bold mb-6 ${getWinnerColorClass()}`}>
          {getWinnerText()}
        </h2>
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-accent to-accent-secondary text-white hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
          <button
            onClick={onChangeMode}
            className="w-full py-3 px-4 rounded-xl font-medium bg-surface border border-border text-text-secondary hover:border-accent transition-colors"
          >
            Change Mode
          </button>
        </div>
      </div>
    </div>
  );
}
