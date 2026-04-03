import { GameState, LLMMoveResult } from './types';
import { getValidMoves } from './gameLogic';
import { getBestMove } from './ai';

function formatBoardState(state: GameState): string {
  const lines: string[] = [];
  for (let b = 0; b < 9; b++) {
    const boardStatus = state.boards[b]
      ? `[${state.boards[b] === 'draw' ? 'DRAW' : state.boards[b]?.toUpperCase()}]`
      : '[open]';
    const cells: string[] = [];
    for (let c = 0; c < 9; c++) {
      const val = state.cells[b * 9 + c];
      cells.push(val === 'x' ? 'X' : val === 'o' ? 'O' : '.');
    }
    lines.push(`Board ${b} ${boardStatus}: ${cells.slice(0, 3).join('')} | ${cells.slice(3, 6).join('')} | ${cells.slice(6, 9).join('')}`);
  }
  if (state.activeBoard !== null) {
    lines.push(`Active board: ${state.activeBoard}`);
  } else {
    lines.push('Active board: any (wildcard)');
  }
  lines.push(`Moves played: ${state.moveHistory.length}`);
  return lines.join('\n');
}

function fallbackResult(state: GameState, reason: string): LLMMoveResult {
  const move = getBestMove(state, 'hard');
  return {
    boardIndex: move!.boardIndex,
    cellIndex: move!.cellIndex,
    reasoning: `Fallback to local hard AI: ${reason}`,
    isFallback: true
  };
}

export async function getLLMMove(state: GameState): Promise<LLMMoveResult | null> {
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65000);

    const response = await fetch('/api/ai-move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        validMoves,
        boardDescription: formatBoardState(state),
        currentPlayer: state.currentPlayer
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) return fallbackResult(state, `server error (${response.status})`);

    const data = await response.json();

    if (data.fallback || !data.move) return fallbackResult(state, data.reason || 'LLM returned no valid move');

    const isValid = validMoves.some(
      m => m.boardIndex === data.move.boardIndex && m.cellIndex === data.move.cellIndex
    );

    if (!isValid) return fallbackResult(state, 'LLM chose an invalid move');

    return {
      boardIndex: data.move.boardIndex,
      cellIndex: data.move.cellIndex,
      reasoning: data.reasoning || null,
      isFallback: false
    };
  } catch (err) {
    const reason = err instanceof DOMException && err.name === 'AbortError' ? 'request timed out' : err instanceof Error ? err.message : 'unknown error';
    return fallbackResult(state, reason);
  }
}
