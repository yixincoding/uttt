# Ultimate Tic-Tac-Toe (TEN) - Game Specification

## 1. Project Overview

- **Project Name**: TEN - Ultimate Tic-Tac-Toe
- **Type**: Web-based interactive game
- **Core Functionality**: A strategic board game where each cell of a 3x3 meta-board contains its own 3x3 small board, with forced move rules and wildcard exceptions
- **Target Users**: Casual gamers who enjoy strategic games, playable on both mobile and desktop

## 2. Technical Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useCallback, useMemo)

## 3. Game Logic Specification

### 3.1 Board Structure

```
Meta-Board (3x3)
├── Small Board 0 │ Small Board 1 │ Small Board 2
├── Small Board 3 │ Small Board 4 │ Small Board 5
└── Small Board 6 │ Small Board 7 │ Small Board 8

Each Small Board is a 3x3 grid of cells
Total: 9 small boards × 9 cells = 81 cells
```

### 3.2 Forced Move Rule

- When a player moves in cell `(row, col)` of a small board, the opponent must play in small board `(row, col)` of the meta-board
- Example: If X plays in the top-right cell (row=0, col=2) of Small Board 4, O must play in Small Board 2
- **Wildcard Exception**: If the forced small board is already won or full, the player may play in ANY available cell on the entire board

### 3.3 Win Conditions

**Small Board Win**: A player wins a small board by getting 3 cells in a row:
- Horizontal: (0,0)-(0,1)-(0,2), (1,0)-(1,1)-(1,2), (2,0)-(2,1)-(2,2)
- Vertical: (0,0)-(1,0)-(2,0), (0,1)-(1,1)-(2,1), (0,2)-(1,2)-(2,2)
- Diagonal: (0,0)-(1,1)-(2,2), (0,2)-(1,1)-(2,0)

**Small Board Draw**: All 9 cells filled with no winner

**Meta-Board Win**: A player wins the game by winning 3 small boards in a row (using the same patterns as small board wins)

### 3.4 Game States

- **Cell States**: 'X', 'O', or null (empty)
- **Small Board States**: 'X_WON', 'O_WON', 'DRAW', or null (ongoing)
- **Meta-Board States**: 'X_WON', 'O_WON', 'DRAW', or null (ongoing)
- **Current Player**: 'X' or 'O'
- **Active Board Index**: 0-8 (which small board is currently playable), or null (wildcard - any board)

## 4. UI/UX Specification

### 4.1 Layout Structure

**Desktop (>768px)**:
- Header: Game title, current turn indicator
- Main: 3x3 meta-board grid with 9 small boards
- Sidebar (right): Move history log, Reset button, Game mode selector
- Footer: Score display for X and O

**Mobile (<768px)**:
- Header: Game title, current turn indicator (compact)
- Main: Meta-board (stacked vertically if needed)
- Bottom panel: Move history (collapsible), Reset button
- Game mode selector at top

### 4.2 Visual Design

**Color Palette**:
- Background: `#0f0f0f` (near black)
- Surface: `#1a1a1a` (dark gray)
- Surface Elevated: `#262626` (medium dark gray)
- Primary (X): `#ff6b6b` (coral red)
- Secondary (O): `#4ecdc4` (teal)
- Accent: `#ffe66d` (golden yellow)
- Text Primary: `#f5f5f5` (off-white)
- Text Muted: `#888888` (gray)
- Active Board Highlight: `#ffe66d` with 20% opacity border
- Win Highlight: `#ffd700` (gold) glow effect

**Typography**:
- Font Family: `'Space Grotesk', sans-serif` (from Google Fonts)
- Title: 2.5rem, bold
- Board Labels: 1.5rem, semibold
- Cell Text: 2rem, bold
- Body/Move History: 0.875rem

**Spacing System**:
- Base unit: 4px
- Small board gap: 8px
- Cell gap: 4px
- Section padding: 24px

**Visual Effects**:
- Active board: 3px solid golden border with subtle pulse animation
- Cell hover: scale(1.05) with 150ms ease transition
- Win animation: Winning cells glow with gold shadow pulse
- Claimed board: Subtle background color tint based on winner

### 4.3 Components

**GameBoard Component**:
- Renders 3x3 meta-grid
- Each cell contains a SmallBoard component
- Props: boards, activeBoard, onCellClick, disabled

**SmallBoard Component**:
- Renders 3x3 grid of cells
- Shows winner badge when claimed
- Props: boardIndex, cells, status, isActive, onCellClick, disabled

**Cell Component**:
- Displays X, O, or empty
- Hover effect when playable
- Props: value, onClick, disabled, isWinningCell

**TurnIndicator Component**:
- Shows current player with colored icon
- Animates on turn change

**MoveHistory Component**:
- Scrollable list of moves
- Format: "Player X played in Board Y, Cell (row,col)"
- Most recent move highlighted

**GameModeSelector Component**:
- Options: "Player vs Player", "Player vs AI"
- AI plays as O

**ResetButton Component**:
- Styled button with hover effect
- Confirmation before reset

**ScoreBoard Component**:
- Shows wins for X and O
- Shows draws

### 4.4 Animations

- **Board activation**: Border pulse (0.5s ease-in-out infinite)
- **Cell placement**: Scale from 0.5 to 1 with bounce (300ms)
- **Win claim**: Board background fade-in (400ms) + scale pop
- **Turn change**: Indicator slide/fade transition

## 5. AI Specification

### 5.1 AI Behavior

- AI plays as O (second player)
- AI uses minimax algorithm with alpha-beta pruning
- Depth limit: 4 (for performance)
- Evaluation heuristic:
  - Win: +1000
  - Loss: -1000
  - Board control: Count of potential winning lines
  - Cell position value: Center > Corners > Edges

### 5.2 AI Move Selection

1. If forced move (wildcard rule doesn't apply), play in forced board
2. If wildcard, evaluate all available cells using minimax
3. Add slight randomness among equally valued moves for variety

## 6. Functionality Specification

### 6.1 Core Features

1. **New Game**: Initialize empty board, X goes first
2. **Make Move**: Click cell to place X or O
3. **Validate Move**: Check if cell is empty and board is active
4. **Update Board**: Mark cell, check for wins, update active board
5. **Switch Turn**: Alternate between X and O
6. **AI Turn**: After human plays X, AI plays O
7. **Game End**: Detect meta-board winner or draw
8. **Move History**: Log all moves with board/cell info
9. **Reset Game**: Clear all state
10. **Mode Selection**: PvP or PvAI

### 6.2 User Interactions

- Click empty cell to make move
- Click Reset to start new game (with confirmation)
- Select game mode from dropdown
- Scroll move history

### 6.3 Edge Cases

- Clicking occupied cell: Ignore
- Clicking inactive board: Ignore
- Clicking when game over: Ignore
- AI thinking: Show subtle loading indicator

## 7. File Structure

```
/src
  /components
    Game.tsx           # Main game container
    GameBoard.tsx      # Meta-board component
    SmallBoard.tsx     # Individual small board
    Cell.tsx           # Individual cell
    TurnIndicator.tsx  # Shows current turn
    MoveHistory.tsx    # Move log
    GameModeSelector.tsx
    ResetButton.tsx
    ScoreBoard.tsx
    Header.tsx
  /hooks
    useGame.ts         # Game state management
    useAI.ts           # AI move calculation
  /utils
    gameLogic.ts       # Win detection, move validation
    constants.ts       # Board configurations
  /types
    index.ts           # TypeScript interfaces
  App.tsx
  main.tsx
  index.css            # Tailwind imports + custom styles
```

## 8. Acceptance Criteria

1. ✓ 3x3 meta-board with 9 small boards renders correctly
2. ✓ Players can click cells to place X and O
3. ✓ Forced move rule works (next board based on previous cell position)
4. ✓ Wildcard rule works (any board when sent to won/full board)
5. ✓ Small board wins are detected and displayed
6. ✓ Meta-board wins are detected and game ends
7. ✓ Active board is visually highlighted
8. ✓ Current player indicator works
9. ✓ Move history logs all moves
10. ✓ Reset button clears game state
11. ✓ Game mode selector switches between PvP and PvAI
12. ✓ AI makes valid moves after human
13. ✓ Responsive design works on mobile and desktop
14. ✓ Animations play smoothly
15. ✓ No console errors during gameplay
