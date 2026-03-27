import { GameState, CellState, BoardState, AIMode } from './types';

export const BOARD_SIZE = 3;
export const CELLS_PER_BOARD = 9;
export const TOTAL_BOARDS = 9;
export const TOTAL_CELLS = 81;
export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function getBoardCells(boardIndex: number): number[] {
  const start = boardIndex * CELLS_PER_BOARD;
  return Array.from({ length: CELLS_PER_BOARD }, (_, i) => start + i);
}

export function getCellBoard(cellIndex: number): number {
  return Math.floor(cellIndex / CELLS_PER_BOARD);
}

export function checkBoardWinner(cells: CellState[], boardIndex: number): BoardState {
  const boardCells = getBoardCells(boardIndex).map(i => cells[i]);
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (boardCells[a] && boardCells[a] === boardCells[b] && boardCells[a] === boardCells[c]) {
      return boardCells[a];
    }
  }
  if (boardCells.every(cell => cell !== null)) {
    return 'draw';
  }
  return null;
}

export function checkMetaWinner(boards: BoardState[]): BoardState {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (boards[a] && boards[a] !== 'draw' && boards[a] === boards[b] && boards[a] === boards[c]) {
      return boards[a];
    }
  }
  return null;
}

export function isBoardPlayable(cells: CellState[], boards: BoardState[], boardIndex: number): boolean {
  if (boards[boardIndex] !== null) return false;
  const boardCells = getBoardCells(boardIndex).map(i => cells[i]);
  return boardCells.some(cell => cell === null);
}

export function canPlayMove(state: GameState, boardIndex: number, cellIndex: number): boolean {
  if (state.cells[cellIndex] !== null) return false;
  if (state.boards[boardIndex] !== null) return false;
  if (state.activeBoard !== null && state.activeBoard !== boardIndex) return false;
  if (state.activeBoard === null && boardsHaveWinningClaim(state.boards, boardIndex)) return false;
  return true;
}

function boardsHaveWinningClaim(boards: BoardState[], boardIndex: number): boolean {
  return boards[boardIndex] !== null;
}

export function getValidMoves(state: GameState): { boardIndex: number; cellIndex: number }[] {
  const moves: { boardIndex: number; cellIndex: number }[] = [];
  if (state.activeBoard !== null) {
    const board = state.activeBoard;
    if (isBoardPlayable(state.cells, state.boards, board)) {
      for (const cell of getBoardCells(board)) {
        if (state.cells[cell] === null) {
          moves.push({ boardIndex: board, cellIndex: cell });
        }
      }
    } else {
      for (let b = 0; b < TOTAL_BOARDS; b++) {
        if (isBoardPlayable(state.cells, state.boards, b)) {
          for (const cell of getBoardCells(b)) {
            if (state.cells[cell] === null) {
              moves.push({ boardIndex: b, cellIndex: cell });
            }
          }
        }
      }
    }
  } else {
    for (let b = 0; b < TOTAL_BOARDS; b++) {
      if (isBoardPlayable(state.cells, state.boards, b)) {
        for (const cell of getBoardCells(b)) {
          if (state.cells[cell] === null) {
            moves.push({ boardIndex: b, cellIndex: cell });
          }
        }
      }
    }
  }
  return moves;
}

export function applyMove(state: GameState, boardIndex: number, cellIndex: number): GameState {
  const cells = [...state.cells];
  cells[cellIndex] = state.currentPlayer;
  const boards = [...state.boards];
  const boardResult = checkBoardWinner(cells, boardIndex);
  if (boardResult !== null) {
    boards[boardIndex] = boardResult;
  }
  const targetBoard = cellIndex % 9;
  const finalActiveBoard = isBoardPlayable(cells, boards, targetBoard) ? targetBoard : null;
  const winner = checkMetaWinner(boards);
  return {
    ...state,
    cells,
    boards,
    activeBoard: finalActiveBoard,
    winner,
    currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x',
    moveHistory: [...state.moveHistory, { player: state.currentPlayer, boardIndex, cellIndex }]
  };
}

export function createInitialState(aiMode: AIMode): GameState {
  return {
    cells: Array(TOTAL_CELLS).fill(null),
    boards: Array(TOTAL_BOARDS).fill(null),
    activeBoard: null,
    currentPlayer: 'x',
    phase: 'playing',
    winner: null,
    moveHistory: [],
    aiMode
  };
}

export function getBoardDisplayValues(cells: CellState[], boardIndex: number): CellState[] {
  const start = boardIndex * CELLS_PER_BOARD;
  return cells.slice(start, start + CELLS_PER_BOARD);
}
