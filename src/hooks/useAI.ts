import { useEffect, useRef } from 'react';
import { GameState, AIDifficulty } from '../types';
import { getAIMove } from '../utils/gameLogic';

const getDepthForDifficulty = (difficulty: AIDifficulty): { depth: number; timeLimit: number } => {
  switch (difficulty) {
    case 'simple': return { depth: 2, timeLimit: 500 };
    case 'median': return { depth: 4, timeLimit: 1500 };
    case 'hard': return { depth: 10, timeLimit: 5000 };
  }
};

export function useAI(
  gameState: GameState,
  makeMove: (boardIndex: number, cellIndex: number) => void
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!gameState.isAIThinking) return;

    const { depth, timeLimit } = getDepthForDifficulty(gameState.aiDifficulty);

    const performAIMove = () => {
      const move = getAIMove(
        gameState.boards,
        gameState.boardStatuses,
        gameState.activeBoard,
        depth,
        timeLimit
      );

      if (move) {
        makeMove(move.boardIndex, move.cellIndex);
      }
    };

    const delay = depth >= 10 ? 500 : depth >= 4 ? 300 : 150;
    timeoutRef.current = setTimeout(performAIMove, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [gameState.isAIThinking, gameState.boards, gameState.boardStatuses, gameState.activeBoard, gameState.aiDifficulty, makeMove]);
}
