import React, { useState } from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (showConfirm) {
      onReset();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full
        px-4 py-2
        rounded-lg
        text-sm font-semibold
        transition-all duration-200
        ${showConfirm
          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
          : 'bg-surface hover:bg-surface-elevated text-text-primary'
        }
      `}
    >
      {showConfirm ? 'Click again to confirm' : 'Reset Game'}
    </button>
  );
};
