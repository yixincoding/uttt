const { 
  getValidMoves, 
  checkBoardWinner, 
  checkMetaWinner, 
  getBoardCells,
  isBoardPlayable,
  WINNING_LINES
} = require('./gameLogic.js');

const TT_EXACT = 0;
const TT_ALPHA = 1;
const TT_BETA = 2;

const MAX_TIME_MS = 3000;
const MAX_DEPTH = 7;

let zobristTable = null;
let transpositionTable = null;

function initZobristTable() {
  if (zobristTable) return;
  
  zobristTable = {
    cells: new Array(81),
    boards: new Array(9),
    player: [0, 0]
  };
  
  let seed = 12345;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed;
  };
  
  for (let i = 0; i < 81; i++) {
    zobristTable.cells[i] = [rand(), rand()];
  }
  
  for (let i = 0; i < 9; i++) {
    zobristTable.boards[i] = [rand(), rand(), rand()];
  }
  
  zobristTable.player[0] = rand();
  zobristTable.player[1] = rand();
}

function hashState(state) {
  let hash = 0;
  
  for (let i = 0; i < 81; i++) {
    if (state.cells[i] === 'x') {
      hash ^= zobristTable.cells[i][0];
    } else if (state.cells[i] === 'o') {
      hash ^= zobristTable.cells[i][1];
    }
  }
  
  for (let i = 0; i < 9; i++) {
    if (state.boards[i] === 'x') {
      hash ^= zobristTable.boards[i][0];
    } else if (state.boards[i] === 'o') {
      hash ^= zobristTable.boards[i][1];
    } else if (state.boards[i] === 'draw') {
      hash ^= zobristTable.boards[i][2];
    }
  }
  
  hash ^= zobristTable.player[state.currentPlayer === 'x' ? 0 : 1];
  
  return hash;
}

function initTranspositionTable() {
  transpositionTable = new Map();
}

function storeTT(hash, depth, score, flag, bestMove) {
  const existing = transpositionTable.get(hash);
  if (!existing || existing.depth <= depth) {
    transpositionTable.set(hash, { depth, score, flag, bestMove });
  }
}

function lookupTT(hash, depth, alpha, beta) {
  const entry = transpositionTable.get(hash);
  if (!entry || entry.depth < depth) return null;
  
  if (entry.flag === TT_EXACT) return { score: entry.score, bestMove: entry.bestMove };
  if (entry.flag === TT_ALPHA && entry.score <= alpha) return { score: alpha, bestMove: entry.bestMove };
  if (entry.flag === TT_BETA && entry.score >= beta) return { score: beta, bestMove: entry.bestMove };
  return null;
}

function applyMoveSimulate(state, boardIndex, cellIndex) {
  const { cells, boards, currentPlayer } = state;
  const newCells = [...cells];
  newCells[cellIndex] = currentPlayer;
  const newBoards = [...boards];
  const boardWinner = checkBoardWinner(newCells, boardIndex);
  if (boardWinner !== null) {
    newBoards[boardIndex] = boardWinner;
  }
  const targetBoard = cellIndex % 9;
  const nextActiveBoard = !isBoardPlayable(newCells, newBoards, targetBoard) ? null : targetBoard;
  return {
    ...state,
    cells: newCells,
    boards: newBoards,
    activeBoard: nextActiveBoard,
    currentPlayer: currentPlayer === 'x' ? 'o' : 'x'
  };
}

function evaluateHeuristic(state, aiPlayer) {
  const { boards } = state;
  let score = 0;

  const metaWinner = checkMetaWinner(boards);
  if (metaWinner === aiPlayer) return 10000;
  if (metaWinner !== null && metaWinner !== 'draw') return -10000;
  if (metaWinner === 'draw') return 0;

  for (let b = 0; b < 9; b++) {
    const boardState = boards[b];
    if (boardState === aiPlayer) {
      score += 100;
    } else if (boardState !== null && boardState !== 'draw') {
      score -= 100;
    } else if (boardState === null) {
      const boardCells = getBoardCells(b).map(i => state.cells[i]);
      const aiCount = boardCells.filter(c => c === aiPlayer).length;
      const oppCount = boardCells.filter(c => c !== null && c !== aiPlayer).length;
      if (aiCount >= 2 && oppCount === 0) {
        score += 10;
      }
    }
  }

  return score;
}

function getWinningMove(state, player) {
  const moves = getValidMoves(state);
  for (const move of moves) {
    const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
    newState.currentPlayer = player;
    if (checkMetaWinner(newState.boards) === player) {
      return move;
    }
  }
  return null;
}

function getTwoInARowCells(cells, boardIndex, player) {
  const boardCells = getBoardCells(boardIndex).map(i => cells[i]);
  const twoInARow = [];
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const vals = [boardCells[a], boardCells[b], boardCells[c]];
    const playerCount = vals.filter(v => v === player).length;
    const emptyCount = vals.filter(v => v === null).length;
    if (playerCount === 2 && emptyCount === 1) {
      const emptyIdx = line[vals.indexOf(null)];
      twoInARow.push(getBoardCells(boardIndex)[emptyIdx]);
    }
  }
  return twoInARow;
}

function getMovePriority(move, state, player) {
  const oppPlayer = player === 'x' ? 'o' : 'x';
  let priority = 0;
  
  const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
  
  if (checkMetaWinner(newState.boards) === player) {
    return 1000;
  }
  
  const stateAfterMove = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
  stateAfterMove.currentPlayer = oppPlayer;
  if (getWinningMove(stateAfterMove, oppPlayer)) {
    if (getWinningMove(state, oppPlayer)) {
      const blockingMoves = getValidMoves(state).filter(m => {
        const ns = applyMoveSimulate(state, m.boardIndex, m.cellIndex);
        ns.currentPlayer = oppPlayer;
        return !getWinningMove(ns, oppPlayer);
      });
      if (blockingMoves.length === 0) {
        return 500;
      }
    }
  }
  
  if (state.boards[move.boardIndex] === null && state.activeBoard !== null) {
    const targetBoard = move.cellIndex % 9;
    if (state.boards[targetBoard] !== null || !isBoardPlayable(state.cells, state.boards, targetBoard)) {
      priority -= 10;
    }
  }
  
  if (move.boardIndex === 4) priority += 5;
  else if ([0, 2, 6, 8].includes(move.boardIndex)) priority += 3;
  
  const localCell = move.cellIndex % 9;
  if (localCell === 4) priority += 2;
  else if ([0, 2, 6, 8].includes(localCell)) priority += 1;
  
  return priority;
}

function orderMoves(moves, state, player) {
  return [...moves].sort((a, b) => {
    const priorityA = getMovePriority(a, state, player);
    const priorityB = getMovePriority(b, state, player);
    return priorityB - priorityA;
  });
}

let nodeCount = 0;
const NODES_PER_TIME_CHECK = 100;

function minimaxTT(state, depth, alpha, beta, isMaximizing, aiPlayer, startTime) {
  nodeCount++;
  
  if (nodeCount % NODES_PER_TIME_CHECK === 0) {
    if (Date.now() - startTime > MAX_TIME_MS) {
      return { score: 0, timeout: true };
    }
  }
  
  const metaWinner = checkMetaWinner(state.boards);
  if (metaWinner === aiPlayer) return { score: 10000 + depth, timeout: false };
  if (metaWinner !== null && metaWinner !== 'draw') return { score: -10000 - depth, timeout: false };
  
  if (depth === 0) {
    return { score: evaluateHeuristic(state, aiPlayer), timeout: false };
  }

  const hash = hashState(state);
  const ttResult = lookupTT(hash, depth, alpha, beta);
  if (ttResult) {
    return { score: ttResult.score, timeout: false };
  }

  const moves = getValidMoves(state);
  if (moves.length === 0) return { score: 0, timeout: false };

  const orderedMoves = orderMoves(moves, state, state.currentPlayer);
  
  let bestMove = orderedMoves[0];
  let flag = TT_ALPHA;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const result = minimaxTT(newState, depth - 1, alpha, beta, false, aiPlayer, startTime);
      
      if (result.timeout) return { score: 0, timeout: true };
      
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) {
        flag = TT_BETA;
        break;
      }
    }
    storeTT(hash, depth, maxEval, flag, bestMove);
    return { score: maxEval, timeout: false };
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const result = minimaxTT(newState, depth - 1, alpha, beta, true, aiPlayer, startTime);
      
      if (result.timeout) return { score: 0, timeout: true };
      
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) {
        flag = TT_ALPHA;
        break;
      }
    }
    storeTT(hash, depth, minEval, flag, bestMove);
    return { score: minEval, timeout: false };
  }
}

function getSimpleAIMove(state) {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;

  if (Math.random() < 0.2) {
    const aiPlayer = state.currentPlayer;
    const oppPlayer = aiPlayer === 'x' ? 'o' : 'x';

    const winMove = getWinningMove(state, aiPlayer);
    if (winMove) return winMove;

    const blockMove = getWinningMove(state, oppPlayer);
    if (blockMove) return blockMove;

    const oppTwoInRow = getTwoInARowCells(state.cells, state.activeBoard ?? -1, oppPlayer);
    if (oppTwoInRow.length > 0) {
      const cellIdx = oppTwoInRow[Math.floor(Math.random() * oppTwoInRow.length)];
      const boardIdx = Math.floor(cellIdx / 9);
      if (state.activeBoard === null || state.activeBoard === boardIdx) {
        return { boardIndex: boardIdx, cellIndex: cellIdx };
      }
    }
  }

  return moves[Math.floor(Math.random() * moves.length)];
}

function getMedianAIMove(state) {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;

  const aiPlayer = state.currentPlayer;
  const scoredMoves = moves.map(move => {
    const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
    const score = evaluateHeuristic(newState, aiPlayer);
    return { ...move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);

  if (scoredMoves.length >= 2 && Math.random() < 0.2) {
    return scoredMoves[1];
  }

  return scoredMoves[0];
}

function getHardAIMove(state) {
  initZobristTable();
  initTranspositionTable();
  
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const aiPlayer = state.currentPlayer;
  const orderedMoves = orderMoves(moves, state, aiPlayer);
  const startTime = Date.now();
  
  let bestMove = orderedMoves[0];
  let bestScore = -Infinity;

  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    let currentBestMove = null;
    let currentBestScore = -Infinity;
    let timedOut = false;

    for (const move of orderedMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      nodeCount = 0;
      const result = minimaxTT(newState, depth - 1, -Infinity, Infinity, false, aiPlayer, startTime);
      
      if (result.timeout) {
        timedOut = true;
        break;
      }
      
      if (result.score > currentBestScore) {
        currentBestScore = result.score;
        currentBestMove = move;
      }
    }

    if (timedOut) {
      break;
    }

    bestMove = currentBestMove;
    bestScore = currentBestScore;
    
    if (bestScore >= 10000) {
      break;
    }
    
    const bestMoveIndex = orderedMoves.findIndex(m => 
      m.boardIndex === bestMove.boardIndex && m.cellIndex === bestMove.cellIndex
    );
    if (bestMoveIndex > 0) {
      orderedMoves.splice(bestMoveIndex, 1);
      orderedMoves.unshift(bestMove);
    }
  }

  return bestMove;
}

function getBestMove(state, difficulty) {
  if (difficulty === 'none') return null;
  
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;

  switch (difficulty) {
    case 'simple':
      return getSimpleAIMove(state);
    case 'median':
      return getMedianAIMove(state);
    case 'hard':
      return getHardAIMove(state);
    default:
      return null;
  }
}

module.exports = {
  getBestMove
};
