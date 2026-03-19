# AGENTS.md - TEN Ultimate Tic-Tac-Toe

## Project Overview
- **Tech Stack**: React 18, TypeScript 5, Tailwind CSS 3.3, Vite 5
- **Purpose**: Web-based Ultimate Tic-Tac-Toe game with AI opponent
- **Location**: `/Users/zhongyixin/Projects/uttt`

---

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
```

### Build
```bash
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
```

### Type Checking
```bash
npx tsc --noEmit     # Run TypeScript compiler without emitting files
```

### No Test Framework
This project does **not** have a test framework (Jest, Vitest, etc.) configured. If adding tests, use Vitest as it integrates well with Vite.

---

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled** (`"strict": true` in tsconfig.json)
- **No unused locals/params** (`noUnusedLocals: true`, `noUnusedParameters: true`)
- **No fallthrough in switch** (`noFallthroughCasesInSwitch: true`)

### File Naming
- Components: `PascalCase.tsx` (e.g., `GameBoard.tsx`, `Cell.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useGame.ts`, `useAI.ts`)
- Utils: `camelCase.ts` (e.g., `gameLogic.ts`)
- Types: `index.ts` in `/types` folder

### Imports
Order imports by:
1. React / external packages (e.g., `react`, `react-dom`)
2. Internal aliases if present
3. Relative imports (e.g., `../types`, `../utils`)

```typescript
// Good
import { useState, useCallback } from 'react';
import { GameState, Player } from '../types';
import { checkSmallBoardWinner } from '../utils/gameLogic';

// Bad - wrong order
import { checkSmallBoardWinner } from '../utils/gameLogic';
import { useState } from 'react';
import { GameState } from '../types';
```

### Types and Interfaces
- Use `type` for unions, primitives, and simple aliases
- Use `interface` for object shapes and complex types
- Export types directly via `export type` or `export interface`

```typescript
// Good
export type CellValue = 'X' | 'O' | null;
export interface GameState {
  boards: CellValue[][];
  currentPlayer: Player;
}

// Bad - unnecessary interface for simple types
export type CellValue = 'X' | 'O' | null;
export type BoardStatus = CellValue | 'DRAW' | null;
```

### Naming Conventions
| Item | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `gameState`, `activeBoard` |
| Functions | camelCase or PascalCase | `makeMove`, `getAIMove`, `SmallBoard` (component) |
| Constants | UPPER_SNAKE_CASE | `WIN_PATTERNS`, `META_CENTER_BOARD` |
| Types/Interfaces | PascalCase | `GameState`, `CellPosition`, `Player` |
| React Components | PascalCase | `GameBoard`, `TurnIndicator` |
| Files | kebab-case | `game-logic.ts`, `use-game.ts` |

### Function Components
```typescript
// Prefer const with arrow function for components
export const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return <button onClick={onClick}>{value}</button>;
};

// Use explicit return type for custom hooks
export function useGame(): UseGameReturn {
  // ...
}
```

### Null Handling
- Use `null` for optional values, not `undefined`
- Use `??` (nullish coalescing) for defaults: `activeBoard ?? null`
- Use `?.` (optional chaining) for nested access: `prev.boardStatuses?.[boardIndex]`
- Prepend unused parameters with underscore: `function foo(_unused: string): void`

### React Patterns
- Destructure props in function signature
- Use `useCallback` for functions passed as props to prevent unnecessary re-renders
- Use `useMemo` for expensive computations
- Always clean up side effects in `useEffect` return function

```typescript
// Good
const Cell: React.FC<CellProps> = ({ value, onClick, disabled }) => {
  return <button onClick={onClick} disabled={disabled}>{value}</button>;
};

// Bad - missing types, no destructuring
const Cell = (props) => {
  return <button onClick={props.onClick}>{props.value}</button>;
};
```

### State Updates with Callbacks
Use functional updates when new state depends on previous:

```typescript
// Good - using prev
setGameState(prev => ({
  ...prev,
  boards: newBoards,
}));

// Avoid - reading state directly during update
setGameState({
  ...gameState,
  boards: newBoards,
});
```

### Magic Numbers
Extract magic numbers as named constants at module level:

```typescript
// Good
const META_CENTER_BOARD = 4;
const META_CORNER_BOARDS = [0, 2, 6, 8];

// Bad
if (boardIndex === 4) { /* center */ }
```

### Error Handling
- No try/catch blocks currently in use
- For AI operations, validate inputs before processing
- Return `null` for operations that can fail gracefully (e.g., no valid moves)

---

## Project Structure
```
src/
├── components/       # React UI components (10 files)
├── hooks/            # Custom React hooks (useGame.ts, useAI.ts)
├── utils/            # Pure functions (gameLogic.ts)
├── types/            # TypeScript type definitions (index.ts)
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Tailwind + custom styles

docs/
└── plans/            # Development documentation
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/utils/gameLogic.ts` | AI minimax, evaluation, win detection (351 lines) |
| `src/hooks/useGame.ts` | Game state management with React hooks |
| `src/hooks/useAI.ts` | AI trigger and move execution |
| `src/types/index.ts` | All TypeScript types and constants |
| `src/components/Game.tsx` | Main game layout and composition |

---

## Common Patterns

### Minimax with Alpha-Beta Pruning
The AI uses iterative deepening with timeout. See `getAIMove()` and `minimax()` in `gameLogic.ts`.

### Board Indexing
- **Meta-board**: 0-8, row-major (0-2 top, 6-8 bottom)
- **Cell index**: 0-8 within a small board, same row-major layout
- **Conversion**: `row = Math.floor(index / 3)`, `col = index % 3`

### Forced Move Rule
Playing in cell `(row, col)` of any small board forces opponent to play in small board `(row, col)` of the meta-board. If that board is won/full, opponent can play anywhere (wildcard).

---

## Adding New Features

1. **Types**: Add new types/interfaces to `src/types/index.ts`
2. **Logic**: Add pure functions to `src/utils/gameLogic.ts`
3. **State**: Manage state in `src/hooks/useGame.ts`
4. **Components**: Create in `src/components/`
5. **Test**: If needed, install Vitest and add tests alongside source files

---

## Tailwind CSS

- Uses custom color palette defined in `tailwind.config.js`
- Custom animations: `pulse-border`, `cell-pop`, `win-glow`
- No arbitrary values (`bg-[...]`) unless necessary
- Mobile-first responsive design with `sm:`, `md:`, `lg:` prefixes
