import { GameState } from './types';
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

export async function getLLMMove(state: GameState): Promise<{ boardIndex: number; cellIndex: number } | null> {
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) return null;

  const fallback = () => getBestMove(state, 'hard');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

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

    if (!response.ok) return fallback();

    const data = await response.json();

    if (data.fallback || !data.move) return fallback();

    const isValid = validMoves.some(
      m => m.boardIndex === data.move.boardIndex && m.cellIndex === data.move.cellIndex
    );

    return isValid ? data.move : fallback();
  } catch {
    return fallback();
  }
}
