import { useReducer, useCallback, useEffect } from 'react';
import { GameState, AIMode } from '../lib/types';
import { createInitialState, applyMove, canPlayMove } from '../lib/gameLogic';
import { getBestMove } from '../lib/ai';

type GameAction =
  | { type: 'SET_AI_MODE'; aiMode: AIMode }
  | { type: 'START_GAME' }
  | { type: 'PLAY_MOVE'; boardIndex: number; cellIndex: number }
  | { type: 'RESET' };

interface UseGameStateReturn {
  state: GameState;
  setAIMode: (aiMode: AIMode) => void;
  startGame: () => void;
  playMove: (boardIndex: number, cellIndex: number) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  cells: Array(81).fill(null),
  boards: Array(9).fill(null),
  activeBoard: null,
  currentPlayer: 'x',
  phase: 'setup',
  winner: null,
  moveHistory: [],
  aiMode: 'none'
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_AI_MODE':
      return { ...state, aiMode: action.aiMode };
    case 'START_GAME':
      return createInitialState(state.aiMode);
    case 'PLAY_MOVE':
      if (!canPlayMove(state, action.boardIndex, action.cellIndex)) {
        return state;
      }
      return {
        ...applyMove(state, action.boardIndex, action.cellIndex),
        phase: state.phase === 'setup' ? 'playing' : state.phase
      };
    case 'RESET':
      return { ...createInitialState(state.aiMode), phase: 'setup' };
    default:
      return state;
  }
}

export function useGameState(): UseGameStateReturn {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setAIMode = useCallback((aiMode: AIMode) => {
    dispatch({ type: 'SET_AI_MODE', aiMode });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const playMove = useCallback((boardIndex: number, cellIndex: number) => {
    dispatch({ type: 'PLAY_MOVE', boardIndex, cellIndex });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    if (state.phase === 'playing' && state.aiMode !== 'none' && state.currentPlayer === 'o' && !state.winner) {
      const timeoutId = setTimeout(() => {
        const bestMove = getBestMove(state, state.aiMode);
        if (bestMove) {
          dispatch({ type: 'PLAY_MOVE', boardIndex: bestMove.boardIndex, cellIndex: bestMove.cellIndex });
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  return {
    state,
    setAIMode,
    startGame,
    playMove,
    resetGame
  };
}
