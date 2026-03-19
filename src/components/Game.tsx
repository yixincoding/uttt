import React from 'react';
import { useGame } from '../hooks/useGame';
import { useAI } from '../hooks/useAI';
import { GameBoard } from './GameBoard';
import { TurnIndicator } from './TurnIndicator';
import { MoveHistory } from './MoveHistory';
import { GameModeSelector } from './GameModeSelector';
import { ResetButton } from './ResetButton';
import { ScoreBoard } from './ScoreBoard';
import { Header } from './Header';

export const Game: React.FC = () => {
  const { gameState, makeMove, resetGame, setGameMode, setUserPlaysFirst, setAIDifficulty } = useGame();
  
  useAI(gameState, makeMove);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="TEN" />
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 p-4">
        <div className="flex flex-col items-center gap-6">
          <TurnIndicator
            currentPlayer={gameState.currentPlayer}
            isAIThinking={gameState.isAIThinking}
            winner={gameState.winner}
          />
          
          <GameBoard gameState={gameState} onCellClick={makeMove} />
          
          <ScoreBoard scores={gameState.scores} />
        </div>

        <aside className="w-full lg:w-64 flex flex-col gap-4 p-4 bg-surface rounded-xl h-[500px] lg:h-auto">
          <GameModeSelector
            gameMode={gameState.gameMode}
            userPlaysFirst={gameState.userPlaysFirst}
            aiDifficulty={gameState.aiDifficulty}
            onModeChange={setGameMode}
            onFirstMoveChange={setUserPlaysFirst}
            onDifficultyChange={setAIDifficulty}
            disabled={gameState.moves.length > 0}
          />
          
          <div className="flex-1 min-h-[150px] overflow-hidden">
            <MoveHistory moves={gameState.moves} />
          </div>
          
          <ResetButton onReset={resetGame} />
        </aside>
      </main>

      <footer className="text-center py-4 text-xs text-text-muted">
        <p>
          {gameState.activeBoard === null
            ? 'Wildcard! Play anywhere!'
            : `Next move in Board ${gameState.activeBoard}`}
        </p>
      </footer>
    </div>
  );
};
