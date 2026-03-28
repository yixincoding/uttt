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
  const isWon = boardState === 'x' || boardState === 'o';

  const getBorderClass = () => {
    if (boardState === 'x') return 'border-red-500 border-4';
    if (boardState === 'o') return 'border-blue-500 border-4';
    if (boardState === 'draw') return 'border-gray-400 border-2';
    if (isWildcard) return 'border-purple-500 border-2';
    if (isActive) return 'border-indigo-500 border-2';
    return 'border-gray-300 border';
  };

  const getBgClass = () => {
    if (isWon) return 'bg-gray-100';
    if (boardState === 'draw') return 'bg-gray-50';
    if (isActive) return 'bg-indigo-50';
    if (isWildcard) return 'bg-purple-50';
    return 'bg-white';
  };

  const winningLine = (() => {
    if (!boardState || boardState === 'draw') return null;
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return line;
      }
    }
    return null;
  })();

  return (
    <div
      className={`
        relative grid grid-cols-3 gap-0.5 p-1 rounded-lg
        transition-all duration-200
        ${getBorderClass()}
        ${getBgClass()}
      `}
    >
      {cells.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          isWinning={winningLine?.includes(index)}
          isDimmed={isWon}
          onClick={() => onCellClick(index)}
          disabled={disabled || boardState !== null}
        />
      ))}

      {isWon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-6xl font-bold ${
              boardState === 'x' ? 'text-red-500' : 'text-blue-500'
            }`}
          >
            {boardState === 'x' ? 'X' : 'O'}
          </span>
        </div>
      )}
    </div>
  );
}
