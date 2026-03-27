# TEN — Ultimate Tic-Tac-Toe Design Spec

## 1. Concept & Vision

TEN is a strategic board game reimagined as a sleek digital experience. The game feels like playing chess in a neon-lit arcade — cerebral depth wrapped in minimalist dark UI. Every interaction is crisp; every state change is visible but never distracting.

## 2. Design Language

**Aesthetic:** Clean dark minimalism with purple/indigo gradient accents — not flashy cyberpunk, but sophisticated arcade.

**Color Palette:**
- Background: `#0a0a0f`
- Card Surface: `#151520` → `#0d0d12` gradient
- Border: `#2a2a35`
- Primary Accent: `#667eea` (indigo)
- Secondary Accent: `#764ba2` (purple)
- X Player: `#667eea`
- O Player: `#f472b6` (pink)
- Text Primary: `#e5e5e5`
- Text Muted: `#888888`

**Typography:**
- Headings: System UI stack, weight 600-800
- Body: System UI, weight 400-500
- Logo: Extra bold, letter-spacing 12px

**Spatial System:**
- Card padding: 32px
- Border radius: 12-20px
- Button radius: 12px
- Grid gap: 6px (cells), 8-12px (boards)

**Motion Philosophy:**
- Subtle, functional transitions (150-200ms ease)
- Board claim: brief pulse/glow animation
- No bouncy or playful animations — this is a strategy game

## 3. Layout & Structure

**Pre-Game Screen:**
1. Centered card with TEN logo and tagline
2. Game mode selection: PvP or PvAI (button group)
3. If PvAI: difficulty selector appears (Simple/Median/Hard)
4. Start button and mode summary

**In-Game Screen:**
1. Header: Game title + current turn indicator
2. Meta-Board: 3×3 grid of Small Boards, each 3×3 grid of cells
3. Sidebar/Overlay: Move history log (scrollable)
4. Footer: Reset button + current game status

**Responsive Strategy:**
- Desktop: Meta-board centered with move history sidebar
- Mobile: Stack vertically, move history as collapsible overlay
- Minimum playable width: 320px

## 4. Features & Interactions

### Core Game Logic

**Board Structure:**
- 1 Meta-Board containing 9 Small Boards
- Each Small Board has 9 cells (81 cells total)
- Small Board states: `active`, `won-by-x`, `won-by-o`, `draw`, `full`

**Forced Move Rule:**
- Player A plays in cell (boardIndex, cellIndex)
- Player B must play in Small Board at `cellIndex`
- Active Small Board highlighted with accent border

**Wildcard Rule:**
- If forced to play in a `won` or `full` Small Board, player may play in ANY available cell on the entire Meta-Board
- No board restriction in this case

**Win Conditions:**
- Small Board: 3 cells in a row (horizontal, vertical, diagonal)
- Meta-Game: 3 Small Boards in a row on Meta-Board
- Draw: All 81 cells filled with no winner

### State Tracking
- 81 cell states: `null | 'x' | 'o'`
- 9 small board states: `null | 'x' | 'o' | 'draw'`
- Active board index: `0-8 | null` (null = wildcard)
- Current player: `'x' | 'o'`
- Move history: array of `{player, boardIndex, cellIndex}`

### AI Modes

**Simple:**
- 80% random moves
- 20% checks: win if possible → block if needed → random

**Median:**
- Minimax with depth 2-3
- 20% noise: picks second-best move occasionally
- Alpha-beta pruning optional

**Hard:**
- Minimax with Alpha-Beta pruning
- Depth 5-7
- Heuristic: +100 small board win, +10 two-in-a-row, +1000 meta-win
- Prefer moves to "dead" boards (won/full)

### Interactions

**Cell Click:**
- Hover: subtle highlight
- Click on valid cell: place mark, animate, update state
- Click on invalid cell (wrong board, won board): no action

**Board Claim:**
- When Small Board is won: border color changes to winner's color
- Brief glow animation on the winning line

**Reset Button:**
- Confirms if game in progress
- Resets all state

**Move History:**
- Each move shows: "X played in Board 5, Cell 7"
- Clickable to review (visual only, no undo)

## 5. Component Inventory

### PreGameCard
- Logo, tagline, mode buttons, difficulty selector, start button
- States: default, ai-mode-selected, difficulty-selected

### MetaBoard
- 3×3 grid container
- Passes activeBoardIndex to children

### SmallBoard
- 3×3 grid of cells
- States: default, active (player's turn here), claimed-x, claimed-o, draw
- Won state: shows winner's mark larger in center

### Cell
- Single clickable square
- States: empty, x, o, disabled (not player's turn), wildcard-available

### TurnIndicator
- Shows current player with their color
- "Your turn" vs "AI thinking..." for AI mode

### MoveHistory
- Scrollable list of moves
- Most recent at top or bottom
- Collapsible on mobile

### ResetButton
- Secondary style button
- Confirmation dialog if game active

### GameOverModal
- Winner announcement or draw
- Play again / Change mode options

## 6. Technical Approach

**Stack:** React 18 + TypeScript + Tailwind CSS + Vite

**Architecture:**
```
src/
├── components/
│   ├── PreGame/
│   ├── Game/
│   │   ├── MetaBoard.tsx
│   │   ├── SmallBoard.tsx
│   │   ├── Cell.tsx
│   │   └── index.tsx
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── MoveHistory.tsx
│   └── index.tsx
├── hooks/
│   ├── useGameState.ts
│   └── useAI.ts
├── lib/
│   ├── gameLogic.ts      # Pure functions for game rules
│   ├── ai.ts              # getBestMove, minimax, heuristics
│   └── types.ts           # TypeScript interfaces
├── App.tsx
└── main.tsx
```

**State Management:**
- Single `useGameState` hook with reducer pattern
- No external state library needed for this scope

**AI Implementation:**
```typescript
function getBestMove(state: GameState, difficulty: 'simple' | 'median' | 'hard'): Move | null

function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number
```

**Key Types:**
```typescript
type Player = 'x' | 'o'
type CellState = Player | null
type BoardState = Player | 'draw' | null
type GamePhase = 'setup' | 'playing' | 'gameover'
type AIMode = 'none' | 'simple' | 'median' | 'hard'

interface GameState {
  cells: CellState[]        // 81 cells
  boards: BoardState[]      // 9 boards
  activeBoard: number | null
  currentPlayer: Player
  phase: GamePhase
  winner: Player | 'draw' | null
  moveHistory: Move[]
  aiMode: AIMode
}

interface Move {
  player: Player
  boardIndex: number
  cellIndex: number
}
```
