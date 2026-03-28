interface RulesModalProps {
  onClose: () => void;
}

function MetaBoardDiagram() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <BoardCell label="0" />
        <BoardCell label="1" />
        <BoardCell label="2" />
      </div>
      <div className="flex gap-1">
        <BoardCell label="3" />
        <BoardCell label="4" />
        <BoardCell label="5" />
      </div>
      <div className="flex gap-1">
        <BoardCell label="6" />
        <BoardCell label="7" />
        <BoardCell label="8" />
      </div>
    </div>
  );
}

function BoardCell({ label, mark }: { label?: string; mark?: string }) {
  return (
    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200">
      {label || (mark && <span className={mark === 'X' ? 'text-red-500 font-bold text-sm' : 'text-blue-500 font-bold text-sm'}>{mark}</span>)}
    </div>
  );
}

function CellIndicesDiagram() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center text-xs font-semibold text-indigo-600 border border-indigo-200">0</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">1</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">2</div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center text-xs font-semibold text-indigo-600 border border-indigo-200">3</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">4</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">5</div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">6</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">7</div>
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">8</div>
      </div>
    </div>
  );
}

function SingleBoardDiagram({ showX, winLine }: { showX?: boolean; winLine?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold border ${winLine ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-200'}`}>
          {showX ? <span className="text-red-500">X</span> : ''}
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>
        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold border ${winLine ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-200'}`}>
          {showX ? <span className="text-red-500">X</span> : ''}
        </div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>
        {showX && <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-sm font-bold text-red-500 border border-red-400">X</div>}
        {!showX && <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>}
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>
      </div>
      <div className="flex gap-0.5">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold border ${winLine ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-200'}`}>
          {showX ? <span className="text-red-500">X</span> : ''}
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-200"></div>
      </div>
    </div>
  );
}

function MetaWinDiagram() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-400 bg-red-50">
          <span className="text-red-500">X</span>
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-400 bg-red-50">
          <span className="text-red-500">X</span>
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
      </div>
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
      </div>
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-400 bg-red-50">
          <span className="text-red-500">X</span>
        </div>
      </div>
    </div>
  );
}

function WildcardDiagram() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-300 bg-red-100 opacity-60">
          <span className="text-red-400">X</span>
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-300 bg-red-100 opacity-60">
          <span className="text-red-400">X</span>
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-red-300 bg-red-100 opacity-60">
          <span className="text-red-400">X</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
      </div>
      <div className="flex gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border-2 border-indigo-400 bg-indigo-50 ring-2 ring-indigo-300">
          <span className="text-indigo-400">?</span>
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold border border-gray-200 bg-gray-50"></div>
      </div>
    </div>
  );
}

export default function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">How to Play</h2>
          
          <div className="space-y-6">
            {/* Section 1: The Board */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. The Board</h3>
              <p className="text-sm text-gray-600 mb-3">
                TEN is played on a meta-board of 9 small boards. Each board contains 9 cells (3×3). That's 81 cells total. Players take turns placing their mark (X or O) in empty cells.
              </p>
              <div className="flex justify-center">
                <MetaBoardDiagram />
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">The 9 small boards numbered 0-8</p>
            </div>

            {/* Section 2: How Your Move Works */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Your Move</h3>
              <p className="text-sm text-gray-600 mb-3">
                Play in any empty cell of the active board. The position you play determines which board your opponent must play in next.
              </p>
              <div className="flex items-center justify-center gap-4">
                <CellIndicesDiagram />
                <div className="flex flex-col items-center text-gray-400">
                  <span className="text-lg">→</span>
                  <span className="text-xs">cell 3 → board 3</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200"></div>
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-xs font-semibold text-indigo-600 border-2 border-indigo-400">4</div>
                </div>
              </div>
            </div>

            {/* Section 3: Forced Move / Wildcard */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. The Wildcard Rule</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you're sent to a board that's already been won or is full, you can play in <strong>ANY</strong> available cell on the meta-board!
              </p>
              <div className="flex items-center justify-center gap-4">
                <WildcardDiagram />
                <div className="text-xs text-gray-500 max-w-[140px]">
                  Board 0 is won (X). Player is sent here → can play anywhere (marked ?)
                </div>
              </div>
            </div>

            {/* Section 4: Winning a Board */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4. Winning a Board</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get 3 of your marks in a row within a small board to win it. Rows, columns, and diagonals all count.
              </p>
              <div className="flex justify-center">
                <SingleBoardDiagram showX winLine />
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">X wins this board!</p>
            </div>

            {/* Section 5: Winning the Game */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">5. Winning the Game</h3>
              <p className="text-sm text-gray-600 mb-3">
                Win the game by claiming 3 small boards in a row on the meta-board (horizontal, vertical, or diagonal).
              </p>
              <div className="flex justify-center">
                <MetaWinDiagram />
              </div>
              <p className="text-xs text-red-500 text-center mt-1 font-medium">X wins the diagonal!</p>
            </div>

            {/* Section 6: Draw */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">6. Draw</h3>
              <p className="text-sm text-gray-600">
                If all 81 cells are filled and no player has won 3 boards in a row, the game is a draw.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
