import { useReducer, useCallback, useEffect, useState } from 'react';
import { GameState, AIMode, LLMMoveResult } from '../lib/types';
import { createInitialState, applyMove, canPlayMove } from '../lib/gameLogic';
import { getBestMove } from '../lib/ai';
import { getLLMMove } from '../lib/llmAi';

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
  lastAIResult: LLMMoveResult | null;
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
  const [lastAIResult, setLastAIResult] = useState<LLMMoveResult | null>(null);

  const setAIMode = useCallback((aiMode: AIMode) => {
    dispatch({ type: 'SET_AI_MODE', aiMode });
  }, []);

  const startGame = useCallback(() => {
    setLastAIResult(null);
    dispatch({ type: 'START_GAME' });
  }, []);

  const playMove = useCallback((boardIndex: number, cellIndex: number) => {
    dispatch({ type: 'PLAY_MOVE', boardIndex, cellIndex });
  }, []);

  const resetGame = useCallback(() => {
    setLastAIResult(null);
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    if (state.phase !== 'playing' || state.winner) return;
    if (state.aiMode === 'none' || state.currentPlayer !== 'o') return;

    if (state.aiMode === 'llm') {
      let cancelled = false;
      getLLMMove(state).then(result => {
        if (!cancelled && result) {
          setLastAIResult(result);
          dispatch({ type: 'PLAY_MOVE', boardIndex: result.boardIndex, cellIndex: result.cellIndex });
        }
      });
      return () => { cancelled = true; };
    }

    const timeoutId = setTimeout(() => {
      const bestMove = getBestMove(state, state.aiMode);
      if (bestMove) {
        dispatch({ type: 'PLAY_MOVE', boardIndex: bestMove.boardIndex, cellIndex: bestMove.cellIndex });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return {
    state,
    setAIMode,
    startGame,
    playMove,
    resetGame,
    lastAIResult
  };
}
