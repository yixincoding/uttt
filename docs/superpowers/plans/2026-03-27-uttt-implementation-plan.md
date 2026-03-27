# TEN — Ultimate Tic-Tac-Toe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Ultimate Tic-Tac-Toe web game with Player vs Player and Player vs AI modes, featuring the Neon Cyberpunk design.

**Architecture:** React 18 + TypeScript + Tailwind CSS + Vite. Pure game logic functions in `lib/`, UI components in `components/`, game state managed via a single `useGameState` hook. AI runs in main thread (game is small enough).

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite

---

## Phase 1: Project Setup

### Task 1: Initialize Vite Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "uttt-v2",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#151520',
        border: '#2a2a35',
        accent: '#667eea',
        'accent-secondary': '#764ba2',
        'player-x': '#667eea',
        'player-o': '#f472b6',
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TEN — Ultimate Tic-Tac-Toe</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 8: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0a0f;
  color: #e5e5e5;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}
```

- [ ] **Step 9: Create src/App.tsx (placeholder)**

```tsx
export default function App() {
  return <div className="min-h-screen bg-bg p-4">TEN - Ultimate Tic-Tac-Toe</div>
}
```

- [ ] **Step 10: Install dependencies and verify build**

Run: `cd /Users/zhongyixin/Projects/uttt-v2 && npm install && npm run build`
Expected: Clean build with no errors

- [ ] **Step 11: Commit**

```bash
git init && git add . && git commit -m "feat: initial Vite + React + TypeScript + Tailwind setup"
```

---

## Phase 2: Core Types and Game Logic

### Task 2: Define TypeScript Types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create src/lib/types.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts && git commit -m "feat: add core TypeScript types"
```

---

### Task 3: Implement Pure Game Logic Functions

**Files:**
- Create: `src/lib/gameLogic.ts`

**Board/Cell Indexing:**
- Board `b` (0-8) contains cells at indices `[b*9 + c` for cell `c` (0-8)
- Cell index within board: `cellIndex % 9` or equivalently `cell % 9`
- Board from cell index: `Math.floor(cellIndex / 9)` or `cellIndex / 9 | 0`

- [ ] **Step 1: Create src/lib/gameLogic.ts with helper functions**

```typescript
import { GameState, Player, CellState, BoardState, Move } from './types';

export const BOARD_SIZE = 3;
export const CELLS_PER_BOARD = 9;
export const TOTAL_BOARDS = 9;
export const TOTAL_CELLS = 81;

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],           // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],           // columns
  [0, 4, 8], [2, 4, 6]                        // diagonals
];

export function getBoardCells(boardIndex: number): number[] {
  const start = boardIndex * CELLS_PER_BOARD;
  return Array.from({ length: CELLS_PER_BOARD }, (_, i) => start + i);
}

export function getCellBoard(cellIndex: number): number {
  return (cellIndex / CELLS_PER_BOARD) | 0;
}

export function checkBoardWinner(cells: CellState[], boardIndex: number): BoardState {
  const boardCells = getBoardCells(boardIndex);
  const values = boardCells.map(i => cells[i]);
  
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = values[a];
    const cellB = values[b];
    const cellC = values[c];
    if (cellA && cellA === cellB && cellB === cellC) {
      return cellA;
    }
  }
  
  // Check for draw (all cells filled)
  if (values.every(v => v !== null)) {
    return 'draw';
  }
  
  return null;
}

export function checkMetaWinner(boards: BoardState[]): BoardState {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const boardA = boards[a];
    const boardB = boards[b];
    const boardC = boards[c];
    if (boardA && boardA !== 'draw' && boardA === boardB && boardB === boardC) {
      return boardA;
    }
  }
  return null;
}

export function isBoardPlayable(cells: CellState[], boards: BoardState[], boardIndex: number): boolean {
  if (boards[boardIndex] !== null) return false;
  const boardCells = getBoardCells(boardIndex);
  return boardCells.some(i => cells[i] === null);
}

export function canPlayMove(state: GameState, boardIndex: number, cellIndex: number): boolean {
  const { cells, boards, activeBoard } = state;
  
  // Check if cell is already occupied
  if (cells[cellIndex] !== null) return false;
  
  // Check if board is already decided
  if (boards[boardIndex] !== null) return false;
  
  // Wildcard: can play anywhere if activeBoard is null
  if (activeBoard === null) return true;
  
  // Must play in the active board
  return boardIndex === activeBoard;
}

export function getValidMoves(state: GameState): { boardIndex: number; cellIndex: number }[] {
  const { cells, boards, activeBoard } = state;
  const moves: { boardIndex: number; cellIndex: number }[] = [];
  
  if (activeBoard !== null) {
    // Must play in active board
    if (isBoardPlayable(cells, boards, activeBoard)) {
      const boardCells = getBoardCells(activeBoard);
      for (const cellIndex of boardCells) {
        if (cells[cellIndex] === null) {
          moves.push({ boardIndex: activeBoard, cellIndex });
        }
      }
    } else {
      // Wildcard - can play anywhere
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const b = getCellBoard(i);
        if (cells[i] === null && boards[b] === null) {
          moves.push({ boardIndex: b, cellIndex: i });
        }
      }
    }
  } else {
    // Wildcard - can play anywhere
    for (let i = 0; i < TOTAL_CELLS; i++) {
      const b = getCellBoard(i);
      if (cells[i] === null && boards[b] === null) {
        moves.push({ boardIndex: b, cellIndex: i });
      }
    }
  }
  
  return moves;
}

export function applyMove(state: GameState, boardIndex: number, cellIndex: number): GameState {
  const { cells, boards, currentPlayer, moveHistory } = state;
  
  // Apply the move
  const newCells = [...cells];
  newCells[cellIndex] = currentPlayer;
  
  // Check if small board is won
  const newBoards = [...boards];
  const boardWinner = checkBoardWinner(newCells, boardIndex);
  if (boardWinner !== null) {
    newBoards[boardIndex] = boardWinner;
  }
  
  // Determine next active board
  const nextActiveBoard = boardWinner === null ? cellIndex % TOTAL_BOARDS : null;
  
  // Check if sending player to a playable board
  if (nextActiveBoard !== null && !isBoardPlayable(newCells, newBoards, nextActiveBoard)) {
    // Will be wildcard
  }
  
  // Check for meta winner
  const metaWinner = checkMetaWinner(newBoards);
  
  // Determine next player
  const nextPlayer: Player = currentPlayer === 'x' ? 'o' : 'x';
  
  const newMove: Move = { player: currentPlayer, boardIndex, cellIndex };
  
  return {
    cells: newCells,
    boards: newBoards,
    activeBoard: nextActiveBoard,
    currentPlayer: nextPlayer,
    phase: metaWinner !== null ? 'gameover' : 'playing',
    winner: metaWinner,
    moveHistory: [...moveHistory, newMove],
    aiMode: state.aiMode
  };
}

export function createInitialState(aiMode: GameState['aiMode']): GameState {
  return {
    cells: Array(TOTAL_CELLS).fill(null),
    boards: Array(TOTAL_BOARDS).fill(null),
    activeBoard: null, // Can start anywhere
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
```

- [ ] **Step 2: Test the game logic functions**

Create `src/lib/gameLogic.test.ts` with comprehensive tests:
- Board cell mapping
- Check board winner
- Check meta winner  
- Can play move validation
- Apply move updates state correctly
- Wildcard rule (activeBoard becomes null when sent to won board)

Run: `npm run test` (or `npx vitest`)
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/lib/gameLogic.ts src/lib/gameLogic.test.ts && git commit -m "feat: implement core game logic"
```

---

## Phase 3: AI Engine

### Task 4: Implement AI with Minimax and Heuristics

**Files:**
- Create: `src/lib/ai.ts`

**Heuristic Scoring:**
- +100 for each small board won
- +10 for each "open" small board with 2-in-a-row (can still win)
- +1000 for winning meta-board
- Negative scores for opponent

**Simple AI:**
- 80% random moves
- 20% checks: win if possible → block if needed → random

**Median AI:**
- Minimax depth 2-3
- 20% noise: picks second-best occasionally

**Hard AI:**
- Minimax + Alpha-Beta, depth 5-7
- Prioritizes sending opponent to dead boards

- [ ] **Step 1: Create src/lib/ai.ts**

```typescript
import { GameState, Player, AIMode } from './types';
import { 
  getValidMoves, 
  checkBoardWinner, 
  checkMetaWinner, 
  getBoardCells,
  getCellBoard,
  boards,
  isBoardPlayable,
  cells
} from './gameLogic';

function evaluateBoardForPlayer(cells: CellState[], boardIndex: number, player: Player): number {
  const boardCells = getBoardCells(boardIndex);
  const values = boardCells.map(i => cells[i]);
  const opponent: Player = player === 'x' ? 'o' : 'x';
  
  // Check if this board is won
  const winner = checkBoardWinner(cells, boardIndex);
  if (winner === player) return 100;
  if (winner === opponent) return -100;
  
  // Count lines with 2 of same player + empty
  let score = 0;
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = values[a];
    const cellB = values[b];
    const cellC = values[c];
    
    // Two in a row with empty
    if (cellA === player && cellB === player && cellC === null) score += 10;
    if (cellA === player && cellB === null && cellC === player) score += 10;
    if (cellA === null && cellB === player && cellC === player) score += 10;
    
    // Block opponent's two in a row
    if (cellA === opponent && cellB === opponent && cellC === null) score -= 8;
    if (cellA === opponent && cellB === null && cellC === opponent) score -= 8;
    if (cellA === null && cellB === opponent && cellC === opponent) score -= 8;
  }
  
  return score;
}

function evaluateState(state: GameState, player: Player): number {
  const { boards: boardStates, cells: allCells } = state;
  const opponent: Player = player === 'x' ? 'o' : 'x';
  
  // Meta win/loss
  const metaWinner = checkMetaWinner(boardStates);
  if (metaWinner === player) return 10000;
  if (metaWinner === opponent) return -10000;
  if (metaWinner === 'draw') return 0;
  
  let score = 0;
  
  // Evaluate each board
  for (let i = 0; i < 9; i++) {
    if (boardStates[i] === null) {
      score += evaluateBoardForPlayer(allCells, i, player);
    }
  }
  
  return score;
}

function getNextActiveBoard(state: GameState, cellIndex: number): number | null {
  const targetBoard = cellIndex % 9;
  const { cells, boards } = state;
  
  // If target board is won or full, it's wildcard
  if (!isBoardPlayable(cells, boards, targetBoard)) {
    return null;
  }
  return targetBoard;
}

function applyMoveSimulate(state: GameState, boardIndex: number, cellIndex: number): GameState {
  const { cells, boards, currentPlayer } = state;
  
  const newCells = [...cells];
  newCells[cellIndex] = currentPlayer;
  
  const newBoards = [...boards];
  const boardWinner = checkBoardWinner(newCells, boardIndex);
  if (boardWinner !== null) {
    newBoards[boardIndex] = boardWinner;
  }
  
  const nextActiveBoard = getNextActiveBoard({ ...state, cells: newCells, boards: newBoards }, cellIndex);
  const nextPlayer: Player = currentPlayer === 'x' ? 'o' : 'x';
  
  return {
    ...state,
    cells: newCells,
    boards: newBoards,
    activeBoard: nextActiveBoard,
    currentPlayer: nextPlayer
  };
}

function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player
): number {
  const opponent: Player = aiPlayer === 'x' ? 'o' : 'x';
  
  // Terminal states
  const metaWinner = checkMetaWinner(state.boards);
  if (metaWinner === aiPlayer) return 10000 + depth;
  if (metaWinner === opponent) return -10000 - depth;
  if (metaWinner === 'draw') return 0;
  
  if (depth === 0) {
    return evaluateState(state, aiPlayer);
  }
  
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) return 0;
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const evalScore = minimax(newState, depth - 1, false, alpha, beta, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const evalScore = minimax(newState, depth - 1, true, alpha, beta, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getWinningMove(state: GameState, player: Player): { boardIndex: number; cellIndex: number } | null {
  const moves = getValidMoves(state);
  for (const move of moves) {
    const testCells = [...state.cells];
    testCells[move.cellIndex] = player;
    if (checkBoardWinner(testCells, move.boardIndex) === player) {
      return move;
    }
  }
  return null;
}

export function getBestMove(state: GameState, difficulty: AIMode): { boardIndex: number; cellIndex: number } | null {
  if (difficulty === 'none') return null;
  
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;
  
  if (difficulty === 'simple') {
    // 20% chance to be smart
    if (Math.random() < 0.2) {
      const player = state.currentPlayer;
      const opponent: Player = player === 'x' ? 'o' : 'x';
      
      // Can I win?
      const winMove = getWinningMove(state, player);
      if (winMove) return winMove;
      
      // Must block opponent?
      const blockMove = getWinningMove(state, opponent);
      if (blockMove) return blockMove;
    }
    
    // Random move
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  if (difficulty === 'median') {
    // Try minimax depth 2
    let bestMove = moves[0];
    let bestScore = -Infinity;
    const aiPlayer = state.currentPlayer;
    
    for (const move of moves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const score = minimax(newState, 2, false, -Infinity, Infinity, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    // 20% noise - pick second best
    if (Math.random() < 0.2 && moves.length > 1) {
      const otherMoves = moves.filter(m => m !== bestMove);
      return otherMoves[Math.floor(Math.random() * otherMoves.length)];
    }
    
    return bestMove;
  }
  
  if (difficulty === 'hard') {
    // Prefer moves to dead boards
    const sortedMoves = [...moves].sort((a, b) => {
      const aDead = !isBoardPlayable(state.cells, state.boards, a.cellIndex % 9);
      const bDead = !isBoardPlayable(state.cells, state.boards, b.cellIndex % 9);
      if (aDead && !bDead) return -1;
      if (!aDead && bDead) return 1;
      return 0;
    });
    
    let bestMove = sortedMoves[0];
    let bestScore = -Infinity;
    const aiPlayer = state.currentPlayer;
    
    for (const move of sortedMoves) {
      const newState = applyMoveSimulate(state, move.boardIndex, move.cellIndex);
      const score = minimax(newState, 5, false, -Infinity, Infinity, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return bestMove;
  }
  
  return moves[0];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai.ts && git commit -m "feat: implement AI engine with minimax and heuristics"
```

---

## Phase 4: State Management

### Task 5: Create useGameState Hook

**Files:**
- Create: `src/hooks/useGameState.ts`

- [ ] **Step 1: Create src/hooks/useGameState.ts**

```typescript
import { useReducer, useCallback, useEffect } from 'react';
import { GameState, AIMode, Player } from '../lib/types';
import { 
  createInitialState, 
  applyMove, 
  canPlayMove, 
  getValidMoves 
} from '../lib/gameLogic';
import { getBestMove } from '../lib/ai';

type GameAction =
  | { type: 'SET_AI_MODE'; aiMode: AIMode }
  | { type: 'START_GAME' }
  | { type: 'PLAY_MOVE'; boardIndex: number; cellIndex: number }
  | { type: 'RESET' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_AI_MODE':
      return { ...state, aiMode: action.aiMode };
    case 'START_GAME':
      return createInitialState(state.aiMode);
    case 'PLAY_MOVE':
      if (state.phase !== 'playing') return state;
      if (!canPlayMove(state, action.boardIndex, action.cellIndex)) return state;
      return applyMove(state, action.boardIndex, action.cellIndex);
    case 'RESET':
      return {
        ...createInitialState(state.aiMode),
        aiMode: state.aiMode
      };
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, {
    cells: Array(81).fill(null),
    boards: Array(9).fill(null),
    activeBoard: null,
    currentPlayer: 'x',
    phase: 'setup',
    winner: null,
    moveHistory: [],
    aiMode: 'none'
  });

  const setAIMode = useCallback((aiMode: AIMode) => {
    dispatch({ type: 'SET_AI_MODE', aiMode });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const playMove = useCallback((boardIndex: number, cellIndex: number) => {
    dispatch({ type: 'PLAY_MOVE', boardIndex, cellIndex });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // AI move effect
  useEffect(() => {
    if (state.phase !== 'playing') return;
    if (state.aiMode === 'none') return;
    if (state.currentPlayer === 'x') return; // AI is O

    const timeoutId = setTimeout(() => {
      const move = getBestMove(state, state.aiMode);
      if (move) {
        dispatch({ type: 'PLAY_MOVE', boardIndex: move.boardIndex, cellIndex: move.cellIndex });
      }
    }, 500); // Small delay for UX

    return () => clearTimeout(timeoutId);
  }, [state.phase, state.currentPlayer, state.aiMode, state.cells.toString()]);

  return {
    state,
    setAIMode,
    startGame,
    playMove,
    resetGame
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useGameState.ts && git commit -m "feat: add useGameState hook with reducer"
```

---

## Phase 5: UI Components

### Task 6: Create PreGame Setup Component

**Files:**
- Create: `src/components/PreGame/PreGame.tsx`
- Create: `src/components/PreGame/index.ts`

- [ ] **Step 1: Create src/components/PreGame/PreGame.tsx**

```tsx
import { useState } from 'react';
import { AIMode } from '../../lib/types';

interface PreGameProps {
  onStart: (aiMode: AIMode) => void;
}

export default function PreGame({ onStart }: PreGameProps) {
  const [mode, setMode] = useState<'pvp' | 'ai' | null>(null);
  const [difficulty, setDifficulty] = useState<AIMode>('none');

  const handleStart = () => {
    if (mode === 'pvp') {
      onStart('none');
    } else if (mode === 'ai') {
      onStart(difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
            TEN
          </h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-2">
            Ultimate Tic-Tac-Toe
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-surface to-bg-dark border border-border rounded-3xl p-8">
          {/* Mode Selection */}
          <p className="text-gray-500 text-xs tracking-widest uppercase text-center mb-4">
            Game Mode
          </p>
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={() => setMode('pvp')}
              className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
                mode === 'pvp'
                  ? 'bg-gradient-to-r from-accent to-accent-secondary text-white'
                  : 'bg-surface border border-border text-gray-400 hover:border-accent hover:text-white'
              }`}
            >
              Player vs Player
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
                mode === 'ai'
                  ? 'bg-gradient-to-r from-accent to-accent-secondary text-white'
                  : 'bg-surface border border-border text-gray-400 hover:border-accent hover:text-white'
              }`}
            >
              Player vs AI
            </button>
          </div>

          {/* Difficulty Selection */}
          {mode === 'ai' && (
            <div className="text-center">
              <p className="text-accent text-xs tracking-widest uppercase mb-3">
                AI Difficulty
              </p>
              <div className="flex gap-2 justify-center">
                {(['simple', 'median', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      difficulty === d
                        ? 'bg-accent text-white'
                        : 'bg-transparent border border-border text-gray-500 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {mode && (
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-4">
                {mode === 'pvp' ? 'Local Multiplayer — X vs O' : `You vs ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} AI`}
              </p>
              <button
                onClick={handleStart}
                className="px-12 py-4 bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/PreGame/index.ts**

```typescript
export { default } from './PreGame';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PreGame/PreGame.tsx src/components/PreGame/index.ts && git commit -m "feat: add PreGame component"
```

---

### Task 7: Create Game Board Components

**Files:**
- Create: `src/components/Game/Cell.tsx`
- Create: `src/components/Game/SmallBoard.tsx`
- Create: `src/components/Game/MetaBoard.tsx`
- Create: `src/components/Game/index.tsx`
- Create: `src/components/Game/index.ts`

- [ ] **Step 1: Create src/components/Game/Cell.tsx**

```tsx
import { Player } from '../../lib/types';

interface CellProps {
  value: Player | null;
  isWinning?: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function Cell({ value, isWinning, onClick, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all
        flex items-center justify-center text-lg sm:text-xl font-bold
        ${disabled || value !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
        ${isWinning ? 'ring-2 ring-accent-secondary' : ''}
        ${value === 'x' ? 'text-player-x' : value === 'o' ? 'text-player-o' : 'text-gray-600'}
        bg-surface
      `}
    >
      {value}
    </button>
  );
}
```

- [ ] **Step 2: Create src/components/Game/SmallBoard.tsx**

```tsx
import { CellState, BoardState, Player } from '../../lib/types';
import { WINNING_LINES } from '../../lib/gameLogic';
import Cell from './Cell';

interface SmallBoardProps {
  cells: CellState[];
  boardState: BoardState;
  isActive: boolean;
  isWildcard: boolean;
  onCellClick: (cellIndex: number) => void;
  disabled: boolean;
}

export default function SmallBoard({
  cells,
  boardState,
  isActive,
  isWildcard,
  onCellClick,
  disabled
}: SmallBoardProps) {
  const getWinningLine = (): number[] | null => {
    if (!boardState || boardState === 'draw') return null;
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (cells[a] === boardState && cells[b] === boardState && cells[c] === boardState) {
        return line;
      }
    }
    return null;
  };

  const winningLine = getWinningLine();

  const getBorderClass = () => {
    if (boardState === 'x') return 'border-player-x';
    if (boardState === 'o') return 'border-player-o';
    if (boardState === 'draw') return 'border-gray-500';
    if (isActive) return 'border-accent shadow-lg shadow-accent/20';
    if (isWildcard) return 'border-accent-secondary';
    return 'border-border';
  };

  return (
    <div
      className={`
        grid grid-cols-3 gap-1 p-2 rounded-xl transition-all
        bg-bg-dark
        ${getBorderClass()}
        ${isActive ? 'ring-2 ring-accent' : ''}
        ${boardState !== null ? 'opacity-80' : ''}
      `}
    >
      {cells.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          isWinning={winningLine?.includes(i)}
          onClick={() => onCellClick(i)}
          disabled={disabled || boardState !== null}
        />
      ))}
      
      {/* Large winner indicator */}
      {boardState && boardState !== 'draw' && (
        <div className={`
          absolute inset-0 flex items-center justify-center
          text-5xl font-black opacity-20 pointer-events-none
          ${boardState === 'x' ? 'text-player-x' : 'text-player-o'}
        `}>
          {boardState.toUpperCase()}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/Game/MetaBoard.tsx**

```tsx
import { GameState } from '../../lib/types';
import { getBoardCells, getCellBoard, getBoardDisplayValues } from '../../lib/gameLogic';
import SmallBoard from './SmallBoard';

interface MetaBoardProps {
  state: GameState;
  onMove: (boardIndex: number, cellIndex: number) => void;
}

export default function MetaBoard({ state, onMove }: MetaBoardProps) {
  const { cells, boards, activeBoard, currentPlayer, phase } = state;
  const isPlayerTurn = phase === 'playing' && (state.aiMode === 'none' || currentPlayer === 'x');

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    const globalCellIndex = boardIndex * 9 + cellIndex;
    onMove(boardIndex, globalCellIndex);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {boards.map((boardState, boardIndex) => {
        const boardCells = getBoardCells(boardIndex);
        const cellValues = boardCells.map(i => cells[i]);
        const isActive = activeBoard === boardIndex;
        const isWildcard = activeBoard === null && phase === 'playing';
        
        return (
          <div key={boardIndex} className="relative">
            <SmallBoard
              cells={cellValues}
              boardState={boardState}
              isActive={isActive}
              isWildcard={isWildcard}
              onCellClick={(cellIdx) => handleCellClick(boardIndex, cellIdx)}
              disabled={!isPlayerTurn}
            />
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create src/components/Game/index.tsx**

```tsx
import { useGameState } from '../../hooks/useGameState';
import MetaBoard from './MetaBoard';
import MoveHistory from '../UI/MoveHistory';
import GameOverModal from '../UI/GameOverModal';
import PreGame from '../PreGame';

export default function Game() {
  const { state, startGame, playMove, resetGame, setAIMode } = useGameState();
  const { currentPlayer } = state;

  if (state.phase === 'setup') {
    return <PreGame onStart={(aiMode) => { setAIMode(aiMode); startGame(); }} />;
  }

  return (
    <div className="min-h-screen bg-bg p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
          TEN
        </h1>
        <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">
          Ultimate Tic-Tac-Toe
        </p>
      </div>

      {/* Turn Indicator */}
      <div className="text-center mb-4">
        {state.phase === 'gameover' ? (
          <p className={`text-lg font-semibold ${state.winner === 'x' ? 'text-player-x' : state.winner === 'o' ? 'text-player-o' : 'text-gray-500'}`}>
            {state.winner === 'draw' ? "It's a Draw!" : `${state.winner?.toUpperCase()} Wins!`}
          </p>
        ) : (
          <p className={`text-lg font-semibold ${currentPlayer === 'x' ? 'text-player-x' : 'text-player-o'}`}>
            {state.aiMode !== 'none' && currentPlayer === 'o' ? 'AI Thinking...' : `${currentPlayer.toUpperCase()}'s Turn`}
          </p>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start max-w-4xl mx-auto">
        {/* Board */}
        <div className="flex-shrink-0">
          <MetaBoard state={state} onMove={playMove} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <MoveHistory moves={state.moveHistory} />
          
          <button
            onClick={resetGame}
            className="w-full mt-4 px-4 py-3 bg-surface border border-border rounded-xl text-gray-400 hover:text-white hover:border-accent transition-all"
          >
            Reset Game
          </button>
        </div>
      </div>

      {/* Game Over Modal */}
      {state.phase === 'gameover' && (
        <GameOverModal 
          winner={state.winner} 
          onPlayAgain={resetGame}
          onChangeMode={() => window.location.reload()}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create index.ts**

```typescript
export { default } from './index.tsx';
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Game/ && git commit -m "feat: add Game board components"
```

---

### Task 8: Create UI Components (MoveHistory, GameOverModal)

**Files:**
- Create: `src/components/UI/MoveHistory.tsx`
- Create: `src/components/UI/GameOverModal.tsx`
- Create: `src/components/UI/index.ts`

- [ ] **Step 1: Create src/components/UI/MoveHistory.tsx**

```tsx
import { Move } from '../../lib/types';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  if (moves.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-4">
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-2">Move History</p>
        <p className="text-gray-600 text-sm">No moves yet</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 max-h-64 overflow-y-auto">
      <p className="text-gray-500 text-xs tracking-widest uppercase mb-3">Move History</p>
      <div className="space-y-1">
        {[...moves].reverse().map((move, i) => (
          <div 
            key={i} 
            className={`text-sm py-1 ${
              move.player === 'x' ? 'text-player-x' : 'text-player-o'
            }`}
          >
            {move.player.toUpperCase()} → Board {move.boardIndex + 1}, Cell {move.cellIndex % 9 + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/UI/GameOverModal.tsx**

```tsx
import type { Player } from '../../lib/types';

interface GameOverModalProps {
  winner: Player | 'draw' | null;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

export default function GameOverModal({ winner, onPlayAgain, onChangeMode }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-3xl p-8 max-w-sm w-full text-center">
        <h2 className={`text-3xl font-black mb-2 ${
          winner === 'x' ? 'text-player-x' : winner === 'o' ? 'text-player-o' : 'text-gray-500'
        }`}>
          {winner === 'draw' ? 'DRAW' : `${winner?.toUpperCase()} WINS`}
        </h2>
        <p className="text-gray-500 mb-8">
          {winner === 'draw' ? 'A well-fought battle!' : 'Victory is sweet!'}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
          <button
            onClick={onChangeMode}
            className="w-full py-3 bg-transparent border border-border text-gray-400 rounded-xl hover:border-accent hover:text-white transition-all"
          >
            Change Mode
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/UI/index.ts**

```typescript
export { default as MoveHistory } from './MoveHistory';
export { default as GameOverModal } from './GameOverModal';
```

- [ ] **Step 4: Commit**

```bash
git add src/components/UI/ && git commit -m "feat: add UI components (MoveHistory, GameOverModal)"
```

---

### Task 9: Update App and Fix Imports

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update src/App.tsx**

```tsx
import Game from './components/Game';

export default function App() {
  return <Game />;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Clean build

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx && git commit -m "feat: wire up App with Game component"
```

---

## Phase 6: Integration & Polish

### Task 10: Add Animations and Final Polish

**Files:**
- Modify: `src/components/Game/SmallBoard.tsx`
- Modify: `src/components/Game/Cell.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add CSS animations for board claims**

```css
@keyframes claim-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes cell-place {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.board-claimed {
  animation: claim-pulse 0.3s ease-out;
}

.cell-placed {
  animation: cell-place 0.2s ease-out;
}
```

- [ ] **Step 2: Apply animations to Cell and SmallBoard**

Add `cell-placed` class to newly placed marks, `board-claimed` to boards when won.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add animations for board claims and cell placement"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Test in browser**

Run: `npm run dev` and verify:
- Pre-game screen shows mode selection
- Game board renders correctly
- Moves work with forced-move rule
- Wildcard rule works
- AI plays when enabled
- Reset works
- Move history updates

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "feat: complete TEN game implementation"
```

---

## File Structure Summary

```
src/
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── gameLogic.ts       # Pure game logic functions
│   └── ai.ts              # AI engine (minimax, heuristics)
├── hooks/
│   └── useGameState.ts    # Game state management
├── components/
│   ├── PreGame/
│   │   └── PreGame.tsx    # Mode/difficulty selection
│   ├── Game/
│   │   ├── Cell.tsx       # Individual cell
│   │   ├── SmallBoard.tsx  # 3x3 board
│   │   ├── MetaBoard.tsx  # 3x3 of SmallBoards
│   │   └── index.tsx      # Game container
│   └── UI/
│       ├── MoveHistory.tsx
│       └── GameOverModal.tsx
├── App.tsx
├── main.tsx
└── index.css
```
