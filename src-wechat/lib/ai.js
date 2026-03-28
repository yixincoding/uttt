const { 
  getValidMoves, 
  checkBoardWinner, 
  checkMetaWinner, 
  getBoardCells,
  isBoardPlayable,
  WINNING_LINES
} = require('./gameLogic.js');

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

function minimax(state, depth, alpha, beta, isMaximizing, aiPlayer) {
  const metaWinner = checkMetaWinner(state.boards);
  if (metaWinner === aiPlayer) return 10000 + depth;
  if (metaWinner !== null && metaWinner !== 'draw') return -10000 - depth;
  
  if (depth === 0) {
    return evaluateHeuristic(state, aiPlayer);
  }

  const moves = getValidMoves(state);
  if (moves.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function sortMovesByPreference(moves, state) {
  return [...moves].sort((a, b) => {
    const aDead = state.boards[a.boardIndex] !== null || !isBoardPlayable(state.cells, state.boards, a.boardIndex);
    const bDead = state.boards[b.boardIndex] !== null || !isBoardPlayable(state.cells, state.boards, b.boardIndex);
    if (aDead && !bDead) return -1;
    if (!aDead && bDead) return 1;
    return 0;
  });
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
    const score = minimax(newState, 2, -Infinity, Infinity, false, aiPlayer);
    return { ...move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);

  if (scoredMoves.length >= 2 && Math.random() < 0.2) {
    return scoredMoves[1];
  }

  return scoredMoves[0];
}

function getHardAIMove(state) {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;

  const aiPlayer = state.currentPlayer;
  const sortedMoves = sortMovesByPreference(moves, state);

  let bestMove = sortedMoves[0];
  let bestScore = -Infinity;
  const depth = 5 + Math.floor(Math.random() * 3);

  for (const move of sortedMoves) {
    const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
    const score = minimax(newState, depth, -Infinity, Infinity, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
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
