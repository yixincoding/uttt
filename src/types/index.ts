export type CellValue = 'X' | 'O' | null;
export type SmallBoardStatus = 'X_WON' | 'O_WON' | 'DRAW' | null;
export type MetaBoardStatus = 'X_WON' | 'O_WON' | 'DRAW' | null;
export type Player = 'X' | 'O';
export type GameMode = 'PvP' | 'PvAI';
export type AIDifficulty = 'simple' | 'median' | 'hard';

export interface CellPosition {
  boardIndex: number;
  cellIndex: number;
}

export interface Move {
  player: Player;
  boardIndex: number;
  cellIndex: number;
  timestamp: number;
}

export interface GameState {
  boards: CellValue[][];
  boardStatuses: SmallBoardStatus[];
  metaStatus: MetaBoardStatus;
  activeBoard: number | null;
  currentPlayer: Player;
  moves: Move[];
  gameMode: GameMode;
  userPlaysFirst: boolean;
  aiDifficulty: AIDifficulty;
  scores: { X: number; O: number; draws: number };
  isAIThinking: boolean;
  winner: Player | 'DRAW' | null;
}

export interface UseGameReturn {
  gameState: GameState;
  makeMove: (boardIndex: number, cellIndex: number) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
  setUserPlaysFirst: (playsFirst: boolean) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
}

export const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const BOARD_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
