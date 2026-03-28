const { BOARD_SIZE, CELLS_PER_BOARD, TOTAL_BOARDS, TOTAL_CELLS } = require('./types.js');

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function getBoardCells(boardIndex) {
  const start = boardIndex * CELLS_PER_BOARD;
  return Array.from({ length: CELLS_PER_BOARD }, (_, i) => start + i);
}

function getCellBoard(cellIndex) {
  return Math.floor(cellIndex / CELLS_PER_BOARD);
}

function checkBoardWinner(cells, boardIndex) {
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

function checkMetaWinner(boards) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (boards[a] && boards[a] !== 'draw' && boards[a] === boards[b] && boards[a] === boards[c]) {
      return boards[a];
    }
  }
  return null;
}

function isBoardPlayable(cells, boards, boardIndex) {
  if (boards[boardIndex] !== null) return false;
  const boardCells = getBoardCells(boardIndex).map(i => cells[i]);
  return boardCells.some(cell => cell === null);
}

function boardsHaveWinningClaim(boards, boardIndex) {
  return boards[boardIndex] !== null;
}

function canPlayMove(state, boardIndex, cellIndex) {
  if (state.cells[cellIndex] !== null) return false;
  if (state.boards[boardIndex] !== null) return false;
  if (state.activeBoard !== null && state.activeBoard !== boardIndex) return false;
  if (state.activeBoard === null && boardsHaveWinningClaim(state.boards, boardIndex)) return false;
  return true;
}

function getValidMoves(state) {
  const moves = [];
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

function applyMove(state, boardIndex, cellIndex) {
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

function createInitialState(aiMode) {
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

function getBoardDisplayValues(cells, boardIndex) {
  const start = boardIndex * CELLS_PER_BOARD;
  return cells.slice(start, start + CELLS_PER_BOARD);
}

module.exports = {
  BOARD_SIZE,
  CELLS_PER_BOARD,
  TOTAL_BOARDS,
  TOTAL_CELLS,
  WINNING_LINES,
  getBoardCells,
  getCellBoard,
  checkBoardWinner,
  checkMetaWinner,
  isBoardPlayable,
  canPlayMove,
  getValidMoves,
  applyMove,
  createInitialState,
  getBoardDisplayValues
};
