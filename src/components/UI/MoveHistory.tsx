import type { Move } from '../../lib/types';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-medium text-text-secondary mb-3">Move History</h3>
      {moves.length === 0 ? (
        <p className="text-text-secondary text-sm">No moves yet</p>
      ) : (
        <ul className="space-y-1">
          {moves.map((move, index) => (
            <li key={index} className="text-sm text-text-primary">
              <span className={move.player === 'x' ? 'text-player-x' : 'text-player-o'}>
                {move.player.toUpperCase()}
              </span>
              {' → '}
              Board {move.boardIndex}, Cell {move.cellIndex}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
