import { CellValue, SmallBoardStatus, WIN_PATTERNS, CellPosition, Player } from '../types';

export function checkSmallBoardWinner(cells: CellValue[]): SmallBoardStatus {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a] === 'X' ? 'X_WON' : 'O_WON';
    }
  }
  if (cells.every(cell => cell !== null)) {
    return 'DRAW';
  }
  return null;
}

export function getCellRowCol(cellIndex: number): { row: number; col: number } {
  return {
    row: Math.floor(cellIndex / 3),
    col: cellIndex % 3,
  };
}

export function getForcedBoardIndex(cellIndex: number): number {
  return cellIndex;
}

export function isBoardPlayable(
  boardStatus: SmallBoardStatus,
  activeBoard: number | null,
  boardIndex: number
): boolean {
  if (boardStatus !== null) return false;
  if (activeBoard === null) return true;
  return activeBoard === boardIndex;
}

export function getNextActiveBoard(
  lastCellIndex: number,
  boardStatuses: SmallBoardStatus[]
): number | null {
  const forcedBoard = getForcedBoardIndex(lastCellIndex);
  if (boardStatuses[forcedBoard] === null) {
    return forcedBoard;
  }
  return null;
}

export function getAvailableCells(
  boards: CellValue[][],
  boardStatuses: SmallBoardStatus[],
  activeBoard: number | null
): CellPosition[] {
  const available: CellPosition[] = [];
  
  if (activeBoard !== null) {
    const board = boards[activeBoard];
    const status = boardStatuses[activeBoard];
    if (status === null) {
      board.forEach((cell, idx) => {
        if (cell === null) {
          available.push({ boardIndex: activeBoard, cellIndex: idx });
        }
      });
    }
  } else {
    boardStatuses.forEach((status, boardIdx) => {
      if (status === null) {
        boards[boardIdx].forEach((cell, cellIdx) => {
          if (cell === null) {
            available.push({ boardIndex: boardIdx, cellIndex: cellIdx });
          }
        });
      }
    });
  }
  
  return available;
}

export function isGameOver(
  _boardStatuses: SmallBoardStatus[],
  metaStatus: SmallBoardStatus | null
): boolean {
  return metaStatus !== null;
}

export function getWinningPattern(cells: CellValue[]): number[] | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export function getWinningBoards(metaBoard: SmallBoardStatus[]): number[] | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (metaBoard[a] && metaBoard[a] !== 'DRAW' && 
        metaBoard[a] === metaBoard[b] && metaBoard[a] === metaBoard[c]) {
      return [a, b, c];
    }
  }
  return null;
}

const META_CENTER_BOARD = 4;
const META_CORNER_BOARDS = [0, 2, 6, 8];
const SMALL_CENTER_CELL = 4;
const SMALL_CORNER_CELLS = [0, 2, 6, 8];

function evaluateTwoInRow(cells: CellValue[], player: Player): number {
  let count = 0;
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    const cellsA = cells[a];
    const cellsB = cells[b];
    const cellsC = cells[c];
    
    const playerCount = [cellsA, cellsB, cellsC].filter(c => c === player).length;
    const emptyCount = [cellsA, cellsB, cellsC].filter(c => c === null).length;
    const opponentCount = [cellsA, cellsB, cellsC].filter(c => c !== null && c !== player).length;
    
    if (playerCount === 2 && emptyCount === 1 && opponentCount === 0) {
      count++;
    }
  }
  return count;
}

function evaluateThreats(cells: CellValue[], player: Player): number {
  let score = 0;
  const opponent = player === 'X' ? 'O' : 'X';
  
  for (let i = 0; i < 9; i++) {
    if (cells[i] === player) {
      if (i === SMALL_CENTER_CELL) {
        score += 10;
      } else if (SMALL_CORNER_CELLS.includes(i)) {
        score += 5;
      } else {
        score += 2;
      }
    } else if (cells[i] === opponent) {
      if (i === SMALL_CENTER_CELL) {
        score -= 10;
      } else if (SMALL_CORNER_CELLS.includes(i)) {
        score -= 5;
      } else {
        score -= 2;
      }
    }
  }
  
  return score;
}

export function evaluateBoard(boards: CellValue[][], boardStatuses: SmallBoardStatus[], player: Player): number {
  const opponent = player === 'X' ? 'O' : 'X';
  let score = 0;

  for (let i = 0; i < 9; i++) {
    const status = boardStatuses[i];
    if (status === player + '_WON') {
      score += 1000;
      continue;
    } else if (status === opponent + '_WON') {
      score -= 1000;
      continue;
    } else if (status === 'DRAW') {
      continue;
    }

    const cells = boards[i];
    
    const aiTwoInRow = evaluateTwoInRow(cells, player);
    const oppTwoInRow = evaluateTwoInRow(cells, opponent);
    
    score += aiTwoInRow * 50;
    score -= oppTwoInRow * 60;
    
    score += evaluateThreats(cells, player);
  }

  for (let i = 0; i < 9; i++) {
    const status = boardStatuses[i];
    if (status !== null) continue;
    
    if (i === META_CENTER_BOARD) {
      score += 30;
    } else if (META_CORNER_BOARDS.includes(i)) {
      score += 15;
    } else {
      score += 5;
    }
  }

  return score;
}

export function getAIMove(
  boards: CellValue[][],
  boardStatuses: SmallBoardStatus[],
  activeBoard: number | null,
  depth: number,
  timeLimitMs: number = 3000
): CellPosition | null {
  const available = getAvailableCells(boards, boardStatuses, activeBoard);
  if (available.length === 0) return null;

  const startTime = Date.now();
  let bestMove: CellPosition | null = null;

  for (let currentDepth = 1; currentDepth <= depth; currentDepth++) {
    if (Date.now() - startTime > timeLimitMs) break;

    let bestScore = -Infinity;
    const currentBestMoves: CellPosition[] = [];

    for (const move of available) {
      if (Date.now() - startTime > timeLimitMs) break;

      const newBoards = boards.map(b => [...b]);
      newBoards[move.boardIndex][move.cellIndex] = 'O';
      
      const newStatuses = boardStatuses.map(status => status);
      const winner = checkSmallBoardWinner(newBoards[move.boardIndex]);
      if (winner) {
        newStatuses[move.boardIndex] = winner;
      }

      const score = minimax(
        newBoards,
        newStatuses,
        getNextActiveBoard(move.cellIndex, newStatuses),
        0,
        true,
        -Infinity,
        Infinity,
        currentDepth
      );

      if (score > bestScore) {
        bestScore = score;
        currentBestMoves.length = 0;
        currentBestMoves.push(move);
      } else if (score === bestScore) {
        currentBestMoves.push(move);
      }
    }

    if (currentBestMoves.length > 0) {
      bestMove = currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    }

    if (bestScore >= 900) break;
  }

  return bestMove || available[0];
}

function minimax(
  boards: CellValue[][],
  boardStatuses: SmallBoardStatus[],
  activeBoard: number | null,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  maxDepth: number
): number {
  const metaWinner = checkMetaBoardWinner(boardStatuses);
  if (metaWinner === 'O_WON') return 1000 - depth;
  if (metaWinner === 'X_WON') return -1000 + depth;
  if (metaWinner === 'DRAW') return 0;
  if (depth >= maxDepth) return evaluateBoard(boards, boardStatuses, 'O');

  const available = getAvailableCells(boards, boardStatuses, activeBoard);
  if (available.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      const newBoards = boards.map(b => [...b]);
      newBoards[move.boardIndex][move.cellIndex] = 'O';
      
      const newStatuses = boardStatuses.map(status => status);
      const winner = checkSmallBoardWinner(newBoards[move.boardIndex]);
      if (winner) {
        newStatuses[move.boardIndex] = winner;
      }

      const evalScore = minimax(
        newBoards,
        newStatuses,
        getNextActiveBoard(move.cellIndex, newStatuses),
        depth + 1,
        false,
        alpha,
        beta,
        maxDepth
      );
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      const newBoards = boards.map(b => [...b]);
      newBoards[move.boardIndex][move.cellIndex] = 'X';
      
      const newStatuses = boardStatuses.map(status => status);
      const winner = checkSmallBoardWinner(newBoards[move.boardIndex]);
      if (winner) {
        newStatuses[move.boardIndex] = winner;
      }

      const evalScore = minimax(
        newBoards,
        newStatuses,
        getNextActiveBoard(move.cellIndex, newStatuses),
        depth + 1,
        true,
        alpha,
        beta,
        maxDepth
      );
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function checkMetaBoardWinner(boardStatuses: SmallBoardStatus[]): SmallBoardStatus {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    const statusA = boardStatuses[a];
    if (statusA && statusA !== 'DRAW' && statusA === boardStatuses[b] && statusA === boardStatuses[c]) {
      return statusA;
    }
  }
  if (boardStatuses.every(s => s !== null)) {
    return 'DRAW';
  }
  return null;
}
