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
      statusText: "X's Turn (Free move!)"
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

  makeMove(boardIndex, globalCellIndex) {
    const { gameState } = this.data;
    const newState = gameLogic.applyMove(gameState, boardIndex, globalCellIndex);

    const winner = newState.winner;
    const phase = winner ? 'gameover' : 'playing';
    const nextPlayer = newState.currentPlayer;

    const freeMove = newState.activeBoard === null;
    const statusText = winner 
      ? (winner === 'draw' ? 'Draw!' : `${winner.toUpperCase()} Wins!`)
      : `${nextPlayer.toUpperCase()}'s Turn${freeMove ? ' (Free move!)' : ''}`;

    this.setData({
      gameState: newState,
      currentPlayer: nextPlayer,
      winner,
      phase,
      isAIThinking: false,
      statusText
    }, () => {
      if (this.data.mode === 'ai' && nextPlayer === 'o' && !winner) {
        this.setData({ isAIThinking: true, statusText: 'AI thinking...' }, () => {
          setTimeout(() => {
            const move = ai.getBestMove(this.data.gameState, this.data.difficulty);
            if (move) {
              this.makeMove(move.boardIndex, move.cellIndex);
            }
          }, 500);
        });
      }
    });
  },

  onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { code } = e.detail;

      wx.login({
        success: (loginRes) => {
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
  }
});
