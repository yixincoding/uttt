# TEN - Ultimate Tic-Tac-Toe Development Plan

## Completed Features

### Core Game (v1.0)
- [x] 3x3 meta-board with 9 small boards (81 cells total)
- [x] **Forced Move Rule**: Playing in cell (row,col) sends opponent to board (row,col)
- [x] **Wildcard Rule**: If forced board is won/full, play anywhere
- [x] **Win conditions**: Small boards (3-in-a-row) and meta-board (3 boards in-a-row)
- [x] **State management**: React hooks tracking all cell states, board statuses, active board, current player
- [x] **Move history** with board/cell coordinates
- [x] **Score tracking**: X wins, O wins, draws
- [x] **Reset button** with confirmation
- [x] **Responsive design** for mobile and desktop
- [x] **Animations**: Board pulse, cell pop, win glow effects
- [x] **Visual indicators**: Active board highlight, turn indicator, AI thinking state

### AI System (v1.1)
- [x] **Minimax algorithm** with alpha-beta pruning
- [x] **3 difficulty levels**:
  - Simple: depth 2, 500ms time limit
  - Median: depth 4, 1500ms time limit
  - Hard: depth 10, 5000ms time limit
- [x] **First move selection**: User plays X or O (AI plays first)
- [x] **Iterative deepening** with timeout for faster response
- [x] **Enhanced evaluation function** considering:
  - Won boards: +1000 / -1000
  - Two in a row with empty third (threat): +50 / -60
  - Cell position values (center > corners > edges)
  - Meta-board position control (center: +30, corners: +15, edges: +5)

### UI/UX Updates
- [x] Move history panel with scrollable container
- [x] Game mode selector with sub-options for AI mode
- [x] First move toggle (You X / AI O)
- [x] Difficulty selector (Simple / Median / Hard)

## Project Structure

```
/src
  /components
    Game.tsx           # Main game container
    GameBoard.tsx      # Meta-board component
    SmallBoard.tsx     # Individual small board
    Cell.tsx           # Individual cell
    TurnIndicator.tsx  # Shows current turn
    MoveHistory.tsx    # Move log with scroll
    GameModeSelector.tsx  # Mode + first move + difficulty
    ResetButton.tsx
    ScoreBoard.tsx
    Header.tsx
  /hooks
    useGame.ts         # Game state management
    useAI.ts           # AI move calculation with timeout
  /utils
    gameLogic.ts      # Win detection, minimax AI, evaluation
  /types
    index.ts          # TypeScript interfaces
  App.tsx
  main.tsx
  index.css           # Tailwind imports + custom styles

/docs
  /plans
    PLAN.md           # This file
```

## Technical Details

### AI Implementation

**Evaluation Function** (`evaluateBoard`):
- Won small board: ±1000
- Two in a row with empty third: ±50 (AI) / ±60 (opponent threat blocking priority)
- Cell ownership: Center (4) = ±10, Corners (0,2,6,8) = ±5, Edges = ±2
- Meta-board position: Center (4) = +30, Corners (0,2,6,8) = +15, Edges = +5

**Iterative Deepening**:
- Starts at depth 1, increments up to max depth
- Time-checked on each iteration and move
- Returns best move at deepest completed depth if timeout
- Early exit if winning move found (score >= 900)

**Time Limits**:
| Difficulty | Max Depth | Time Limit | Per-Move Delay |
|------------|-----------|------------|----------------|
| Simple     | 2         | 500ms      | 150ms          |
| Median     | 4         | 1500ms     | 300ms          |
| Hard       | 10        | 5000ms     | 500ms          |

## Future Enhancements

Potential improvements not yet implemented:

- [ ] Undo move functionality
- [ ] Hint system showing suggested moves
- [ ] Sound effects for moves and wins
- [ ] Animation for AI "thinking" (showing difficulty)
- [ ] Save/load game state to localStorage
- [ ] Statistics page with win rates
- [ ] Tournament mode
- [ ] Online multiplayer
- [ ] Custom themes/colors
- [ ] Keyboard navigation support

## Running the Project

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Dependencies

- React 18
- TypeScript 5
- Tailwind CSS 3.3
- Vite 5
