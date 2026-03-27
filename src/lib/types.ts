export type Player = 'x' | 'o';
export type CellState = Player | null;
export type BoardState = Player | 'draw' | null;
export type GamePhase = 'setup' | 'playing' | 'gameover';
export type AIMode = 'none' | 'simple' | 'median' | 'hard';

export interface Move {
  player: Player;
  boardIndex: number;
  cellIndex: number;
}

export interface GameState {
  cells: CellState[];        // 81 cells: indices 0-80
  boards: BoardState[];      // 9 boards: indices 0-8
  activeBoard: number | null; // null = wildcard (can play anywhere)
  currentPlayer: Player;
  phase: GamePhase;
  winner: Player | 'draw' | null;
  moveHistory: Move[];
  aiMode: AIMode;
}

export interface AIBestMoveResult {
  boardIndex: number;
  cellIndex: number;
}
