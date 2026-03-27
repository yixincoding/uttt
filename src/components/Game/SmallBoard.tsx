import { CellState, BoardState } from '../../lib/types';
import { WINNING_LINES } from '../../lib/gameLogic';
import Cell from './Cell';

interface SmallBoardProps {
  cells: CellState[];
  boardState: BoardState;
  isActive: boolean;
  isWildcard: boolean;
  onCellClick: (cellIndex: number) => void;
  disabled: boolean;
}

export default function SmallBoard({
  cells,
  boardState,
  isActive,
  isWildcard,
  onCellClick,
  disabled
}: SmallBoardProps) {
  const getBorderClass = () => {
    if (boardState === 'x') return 'border-player-x';
    if (boardState === 'o') return 'border-player-o';
    if (boardState === 'draw') return 'border-gray-500';
    if (isWildcard) return 'border-accent-secondary';
    if (isActive) return 'border-accent';
    return 'border-border';
  };

  const getWinningLine = (): number[] | null => {
    if (!boardState || boardState === 'draw') return null;
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return line;
      }
    }
    return null;
  };

  const winningLine = getWinningLine();

  return (
    <div
      className={`
        relative grid grid-cols-3 gap-1 p-2 rounded-xl
        border-2 transition-all duration-200
        ${getBorderClass()}
        ${isActive && !boardState ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}
        ${disabled && !boardState ? 'opacity-50' : ''}
      `}
    >
      {cells.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          isWinning={winningLine?.includes(index)}
          onClick={() => onCellClick(index)}
          disabled={disabled || boardState !== null}
        />
      ))}

      {boardState && boardState !== 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`
              text-6xl font-bold opacity-20
              ${boardState === 'x' ? 'text-player-x' : 'text-player-o'}
            `}
          >
            {boardState === 'x' ? 'X' : 'O'}
          </span>
        </div>
      )}
    </div>
  );
}
