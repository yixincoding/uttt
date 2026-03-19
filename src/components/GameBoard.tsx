import React from 'react';
import { GameState } from '../types';
import { SmallBoard } from './SmallBoard';
import { isBoardPlayable } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick }) => {
  const { boards, boardStatuses, activeBoard, winner, isAIThinking } = gameState;
  const isDisabled = !!winner || isAIThinking;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-background rounded-xl">
      {boards.map((board, boardIndex) => {
        const isActive = isBoardPlayable(
          boardStatuses[boardIndex],
          activeBoard,
          boardIndex
        );

        return (
          <SmallBoard
            key={boardIndex}
            boardIndex={boardIndex}
            cells={board}
            status={boardStatuses[boardIndex]}
            isActive={isActive}
            onCellClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
            disabled={isDisabled}
          />
        );
      })}
    </div>
  );
};
