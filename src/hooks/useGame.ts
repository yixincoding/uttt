import { useState, useCallback } from 'react';
import { GameState, GameMode, Player, SmallBoardStatus, AIDifficulty } from '../types';
import {
  checkSmallBoardWinner,
  getNextActiveBoard,
  getWinningBoards,
} from '../utils/gameLogic';

const createInitialBoards = (): GameState['boards'] => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

const createInitialState = (): GameState => ({
  boards: createInitialBoards(),
  boardStatuses: Array(9).fill(null),
  metaStatus: null,
  activeBoard: null,
  currentPlayer: 'X',
  moves: [],
  gameMode: 'PvP',
  userPlaysFirst: true,
  aiDifficulty: 'median',
  scores: { X: 0, O: 0, draws: 0 },
  isAIThinking: false,
  winner: null,
});

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);

  const makeMove = useCallback((boardIndex: number, cellIndex: number) => {
    setGameState(prev => {
      if (prev.winner) return prev;
      
      const board = prev.boards[boardIndex];
      if (board[cellIndex] !== null) return prev;
      
      if (prev.activeBoard !== null && prev.activeBoard !== boardIndex) return prev;
      if (prev.boardStatuses[boardIndex] !== null) return prev;

      const newBoards = prev.boards.map(b => [...b]);
      newBoards[boardIndex][cellIndex] = prev.currentPlayer;

      const newStatuses = [...prev.boardStatuses];
      const smallWinner = checkSmallBoardWinner(newBoards[boardIndex]);
      if (smallWinner) {
        newStatuses[boardIndex] = smallWinner;
      }

      const nextActiveBoard = getNextActiveBoard(cellIndex, newStatuses);
      
      const metaWinner = getWinningBoards(newStatuses);

      let finalMetaStatus: SmallBoardStatus | null = null;
      let winner: Player | 'DRAW' | null = null;
      let newScores = { ...prev.scores };

      if (metaWinner) {
        const metaWinStatus = newStatuses[metaWinner[0]] as 'X_WON' | 'O_WON';
        finalMetaStatus = metaWinStatus;
        winner = metaWinStatus === 'X_WON' ? 'X' : 'O';
        newScores[winner]++;
      } else if (newStatuses.every(s => s !== null)) {
        finalMetaStatus = 'DRAW';
        winner = 'DRAW';
        newScores.draws++;
      }

      const newMove = {
        player: prev.currentPlayer,
        boardIndex,
        cellIndex,
        timestamp: Date.now(),
      };

      const nextPlayer: Player = prev.currentPlayer === 'X' ? 'O' : 'X';
      const isAIThinking = prev.gameMode === 'PvAI' && nextPlayer === 'O' && !winner;

      return {
        ...prev,
        boards: newBoards,
        boardStatuses: newStatuses,
        metaStatus: finalMetaStatus,
        activeBoard: nextActiveBoard,
        currentPlayer: nextPlayer,
        moves: [...prev.moves, newMove],
        winner,
        scores: newScores,
        isAIThinking,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...createInitialState(),
      gameMode: prev.gameMode,
      userPlaysFirst: prev.userPlaysFirst,
      aiDifficulty: prev.aiDifficulty,
      currentPlayer: prev.userPlaysFirst ? 'X' : 'O',
      isAIThinking: !prev.userPlaysFirst,
    }));
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setGameState(() => ({
      ...createInitialState(),
      gameMode: mode,
      userPlaysFirst: true,
      aiDifficulty: 'median',
      currentPlayer: 'X',
      isAIThinking: false,
    }));
  }, []);

  const setUserPlaysFirst = useCallback((playsFirst: boolean) => {
    setGameState(prev => ({
      ...createInitialState(),
      gameMode: prev.gameMode,
      userPlaysFirst: playsFirst,
      aiDifficulty: prev.aiDifficulty,
      currentPlayer: playsFirst ? 'X' : 'O',
      isAIThinking: !playsFirst && prev.gameMode === 'PvAI',
    }));
  }, []);

  const setAIDifficulty = useCallback((difficulty: AIDifficulty) => {
    setGameState(prev => ({
      ...prev,
      aiDifficulty: difficulty,
    }));
  }, []);

  return { gameState, makeMove, resetGame, setGameMode, setUserPlaysFirst, setAIDifficulty };
}
