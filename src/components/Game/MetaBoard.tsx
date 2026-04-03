import { GameState } from '../../lib/types';
import { getBoardCells, isBoardPlayable } from '../../lib/gameLogic';
import SmallBoard from './SmallBoard';

interface MetaBoardProps {
  state: GameState;
  onMove: (boardIndex: number, cellIndex: number) => void;
}

export default function MetaBoard({ state, onMove }: MetaBoardProps) {
  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    const globalCellIndex = boardIndex * 9 + cellIndex;
    onMove(boardIndex, globalCellIndex);
  };

  const getSmallBoardCells = (boardIndex: number) => {
    return getBoardCells(boardIndex).map(i => state.cells[i]);
  };

  const isBoardActive = (boardIndex: number): boolean => {
    if (state.boards[boardIndex] !== null) return false;
    if (state.activeBoard !== null) {
      return state.activeBoard === boardIndex;
    }
    return isBoardPlayable(state.cells, state.boards, boardIndex);
  };

  const isWildcard = (boardIndex: number): boolean => {
    return state.activeBoard === null && isBoardPlayable(state.cells, state.boards, boardIndex);
  };

  const isDisabled = state.phase !== 'playing' || state.winner !== null;

  const lastMove = state.moveHistory.length > 0 ? state.moveHistory[state.moveHistory.length - 1] : null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, boardIndex) => (
        <SmallBoard
          key={boardIndex}
          cells={getSmallBoardCells(boardIndex)}
          boardState={state.boards[boardIndex]}
          isActive={isBoardActive(boardIndex)}
          isWildcard={isWildcard(boardIndex)}
          lastMoveCellIndex={lastMove && lastMove.boardIndex === boardIndex ? lastMove.cellIndex % 9 : null}
          onCellClick={(cellIndex) => handleCellClick(boardIndex, cellIndex)}
          disabled={isDisabled}
        />
      ))}
    </div>
  );
}
