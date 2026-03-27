import { Player } from '../../lib/types';

interface CellProps {
  value: Player | null;
  isWinning?: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function Cell({ value, isWinning, onClick, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        aspect-square rounded-lg font-bold text-2xl sm:text-3xl
        flex items-center justify-center
        transition-all duration-200
        ${value === 'x' ? 'text-player-x' : value === 'o' ? 'text-player-o' : 'text-gray-500'}
        ${disabled || value !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-surface'}
        ${isWinning ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}
      `}
    >
      {value === 'x' ? 'X' : value === 'o' ? 'O' : ''}
    </button>
  );
}
