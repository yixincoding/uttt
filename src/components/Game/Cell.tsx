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
        aspect-square rounded-md font-bold text-lg sm:text-xl
        flex items-center justify-center
        transition-all duration-150
        ${value === 'x' ? 'text-red-500' : value === 'o' ? 'text-blue-500' : 'text-gray-400'}
        ${disabled || value !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
        ${isWinning ? 'bg-yellow-100' : 'bg-white'}
        border border-gray-200
      `}
    >
      {value === 'x' ? 'X' : value === 'o' ? 'O' : ''}
    </button>
  );
}
