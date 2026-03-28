const gameLogic = require('../../lib/gameLogic.js');
const ai = require('../../lib/ai.js');

Page({
  data: {
    gameState: null,
    phase: 'setup',
    mode: null,
    difficulty: 'median',
    selectedMode: null,
    selectedDifficulty: 'median',
    isAIThinking: false,
    hasLogin: false,
    winner: null,
    currentPlayer: 'x',
    statusText: 'Select mode to start',
    showRules: false
  },

  onLoad(options) {
    const seenRules = wx.getStorageSync('seenRules');
    if (!seenRules) {
      this.setData({ showRules: true });
    }
    if (options.mode) {
      this.setData({ selectedMode: options.mode });
    }
  },

  onCloseRules() {
    wx.setStorageSync('seenRules', 'true');
    this.setData({ showRules: false });
  },

  onSelectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ selectedMode: mode });
  },

  onSelectDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ selectedDifficulty: difficulty, difficulty });
  },

  onStart() {
    const { selectedMode } = this.data;
    if (!selectedMode) return;

    const aiMode = selectedMode === '2p' ? 'none' : this.data.difficulty;
    const gameState = gameLogic.createInitialState(aiMode);

    this.setData({
      gameState,
      phase: 'playing',
      mode: selectedMode,
      difficulty: this.data.difficulty,
      selectedDifficulty: this.data.difficulty,
      currentPlayer: 'x',
      winner: null,
      isAIThinking: false,
      statusText: this.computeStatusText()
    });
  },

  onReset() {
    this.initGame();
  },

  initGame() {
    this.setData({
      gameState: null,
      phase: 'setup',
      mode: null,
      difficulty: 'median',
      selectedMode: null,
      selectedDifficulty: 'median',
      isAIThinking: false,
      hasLogin: false,
      winner: null,
      currentPlayer: 'x',
      statusText: 'Select mode to start'
    });
  },

  onCellTap(e) {
    const dataset = e.currentTarget.dataset;
    const boardIndex = parseInt(dataset.board, 10);
    const cellIndex = parseInt(dataset.ci, 10);
    const globalCellIndex = boardIndex * 9 + cellIndex;

    const { gameState } = this.data;
    if (!gameLogic.canPlayMove(gameState, boardIndex, globalCellIndex)) {
      return;
    }

    this.makeMove(boardIndex, globalCellIndex);
  },

  makeMove(boardIndex, cellIndex) {
    const { gameState } = this.data;
    const newState = gameLogic.applyMove(gameState, boardIndex, cellIndex);

    const winner = newState.winner;
    const phase = winner ? 'gameover' : 'playing';

    this.setData({
      gameState: newState,
      currentPlayer: newState.currentPlayer,
      winner,
      phase,
      statusText: this.computeStatusText()
    });

    this.checkAndTriggerAI();
  },

  checkAndTriggerAI() {
    const { mode, currentPlayer, winner, difficulty, gameState } = this.data;
    console.log('checkAndTriggerAI:', { mode, currentPlayer, winner });

    if (mode !== 'ai') return;
    if (currentPlayer !== 'o') return;
    if (winner) return;

    this.setData({ isAIThinking: true });

    setTimeout(() => {
      console.log('AI timeout firing');
      const move = ai.getBestMove(gameState, difficulty);
      console.log('AI move:', move);
      if (move) {
        this.makeMove(move.boardIndex, move.cellIndex);
      }
      this.setData({ isAIThinking: false });
      console.log('AI move complete, isAIThinking set to false');
    }, 500);
  },

  computeStatusText() {
    const { winner, isAIThinking, phase, currentPlayer } = this.data;
    console.log('computeStatusText:', { winner, isAIThinking, phase, currentPlayer });
    if (winner) {
      return winner === 'draw' ? 'Draw!' : `${winner.toUpperCase()} Wins!`;
    }
    if (isAIThinking) return 'AI thinking...';
    if (phase === 'setup') return 'Select mode to start';
    return `${currentPlayer.toUpperCase()}'s Turn`;
  },

  onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { code } = e.detail;

      wx.login({
        success: (loginRes) => {
          console.log('Phone auth code:', code);
          console.log('Login code:', loginRes.code);

          this.setData({ hasLogin: true });

          const app = getApp();
          app.globalData.hasLogin = true;

          wx.showToast({
            title: 'Login successful',
            icon: 'success',
            duration: 2000
          });
        },
        fail: () => {
          wx.showToast({
            title: 'Login failed',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } else {
      wx.showToast({
        title: 'Login cancelled',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.setData({ hasLogin: true });
          const app = getApp();
          app.globalData.hasLogin = true;
          wx.showToast({
            title: 'Login successful',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Login failed',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  onShareAppMessage() {
    const { mode, difficulty, winner } = this.data;
    
    let title = 'TEN — Ultimate Tic-Tac-Toe';
    if (winner) {
      title = winner === 'draw' 
        ? 'TEN: It was a draw! 🎮' 
        : `TEN: ${winner.toUpperCase()} Wins! 🎮`;
    }
    
    return {
      title,
      path: `/pages/index/index?mode=${mode || ''}&difficulty=${difficulty || ''}`,
    };
  },

  onShareTimeline() {
    const { mode, difficulty, winner } = this.data;
    
    let title = 'TEN — Ultimate Tic-Tac-Toe';
    if (winner) {
      title = winner === 'draw' 
        ? 'TEN: It was a draw! 🎮' 
        : `TEN: ${winner.toUpperCase()} Wins! 🎮`;
    }
    
    return {
      title,
      query: `mode=${mode || ''}&difficulty=${difficulty || ''}`,
    };
  },

  getCellValue(boardIndex, cellIdx) {
    const { gameState } = this.data;
    if (!gameState) return '';
    const globalIndex = boardIndex * 9 + cellIdx;
    return gameState.cells[globalIndex] || '';
  },

  getCellClass(boardIndex, cellIdx) {
    const { gameState } = this.data;
    if (!gameState) return '';
    const globalIndex = boardIndex * 9 + cellIdx;
    const value = gameState.cells[globalIndex];
    if (value === 'x') return 'x-mark';
    if (value === 'o') return 'o-mark';
    return '';
  },

  getCellDisabled(boardIndex, cellIdx) {
    const { gameState, phase, isAIThinking, winner } = this.data;
    if (!gameState || phase !== 'playing' || isAIThinking) return true;
    if (winner) return true;
    const globalIndex = boardIndex * 9 + cellIdx;
    if (gameState.cells[globalIndex] !== null) return true;
    if (gameState.boards[boardIndex] !== null) return true;
    if (gameState.activeBoard !== null && gameState.activeBoard !== boardIndex) return true;
    return false;
  },

  getSmallBoardClass(boardIndex) {
    const { gameState } = this.data;
    if (!gameState) return '';
    const boardState = gameState.boards[boardIndex];
    if (boardState === 'x') return 'won-x';
    if (boardState === 'o') return 'won-o';
    if (boardState === 'draw') return 'draw';
    if (gameState.activeBoard === boardIndex) return 'active';
    return '';
  },

  getSmallBoardWinner(boardIndex) {
    const { gameState } = this.data;
    if (!gameState) return '';
    return gameState.boards[boardIndex] || '';
  }
});
