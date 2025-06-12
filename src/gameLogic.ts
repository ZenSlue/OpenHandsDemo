import { Direction, GameState, Position, GameHistoryState } from './types';

const BOARD_SIZE = 4;

export const createEmptyBoard = (): number[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
};

export const getEmptyPositions = (board: number[][]): Position[] => {
  const positions: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
};

export const addRandomTile = (board: number[][]): number[][] => {
  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return board;

  const newBoard = board.map(row => [...row]);
  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  newBoard[randomPosition.row][randomPosition.col] = value;
  return newBoard;
};

// 虚拟币系统常量
export const COIN_REWARDS = {
  FIRST_WIN: 100,
  DAILY_BONUS: 10,
  SCORE_MILESTONE: 50, // 每1000分奖励
  TILE_ACHIEVEMENT: 25, // 达成新的最高数字
};

export const COIN_COSTS = {
  UNDO: 20,
  HINT: 10,
  SHUFFLE: 50,
};

// 从localStorage加载虚拟币
const loadCoins = (): number => {
  const saved = localStorage.getItem('2048-coins');
  return saved ? parseInt(saved, 10) : 100; // 新用户赠送100虚拟币
};

// 保存虚拟币到localStorage
export const saveCoins = (coins: number): void => {
  localStorage.setItem('2048-coins', coins.toString());
};

export const initializeGame = (): GameState => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  
  return {
    board,
    score: 0,
    gameOver: false,
    won: false,
    coins: loadCoins(),
    history: []
  };
};

const moveLeft = (row: number[]): { row: number[], score: number } => {
  const filtered = row.filter(val => val !== 0);
  const merged: number[] = [];
  let score = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      merged.push(mergedValue);
      score += mergedValue;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i += 1;
    }
  }

  while (merged.length < BOARD_SIZE) {
    merged.push(0);
  }

  return { row: merged, score };
};

const rotateBoard = (board: number[][]): number[][] => {
  const newBoard = createEmptyBoard();
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      newBoard[col][BOARD_SIZE - 1 - row] = board[row][col];
    }
  }
  return newBoard;
};

const flipBoard = (board: number[][]): number[][] => {
  return board.map(row => [...row].reverse());
};

export const move = (board: number[][], direction: Direction): { board: number[][], score: number, moved: boolean } => {
  let workingBoard = board.map(row => [...row]);
  let totalScore = 0;
  let moved = false;

  switch (direction) {
    case 'left':
      break;
    case 'right':
      workingBoard = flipBoard(workingBoard);
      break;
    case 'up':
      workingBoard = rotateBoard(rotateBoard(rotateBoard(workingBoard)));
      break;
    case 'down':
      workingBoard = rotateBoard(workingBoard);
      break;
  }

  const newBoard = workingBoard.map(row => {
    const result = moveLeft(row);
    totalScore += result.score;
    return result.row;
  });

  // Check if any movement occurred
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (workingBoard[i][j] !== newBoard[i][j]) {
        moved = true;
        break;
      }
    }
    if (moved) break;
  }

  let finalBoard = newBoard;

  switch (direction) {
    case 'left':
      break;
    case 'right':
      finalBoard = flipBoard(finalBoard);
      break;
    case 'up':
      finalBoard = rotateBoard(finalBoard);
      break;
    case 'down':
      finalBoard = rotateBoard(rotateBoard(rotateBoard(finalBoard)));
      break;
  }

  return { board: finalBoard, score: totalScore, moved };
};

export const isGameOver = (board: number[][]): boolean => {
  // Check for empty cells
  if (getEmptyPositions(board).length > 0) {
    return false;
  }

  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const current = board[row][col];
      
      // Check right neighbor
      if (col < BOARD_SIZE - 1 && board[row][col + 1] === current) {
        return false;
      }
      
      // Check bottom neighbor
      if (row < BOARD_SIZE - 1 && board[row + 1][col] === current) {
        return false;
      }
    }
  }

  return true;
};

export const hasWon = (board: number[][]): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
};

// 添加历史记录
export const addToHistory = (gameState: GameState): GameState => {
  const historyEntry: GameHistoryState = {
    board: gameState.board.map(row => [...row]),
    score: gameState.score,
    timestamp: Date.now()
  };

  const newHistory = [...gameState.history, historyEntry];
  
  // 只保留最近10步历史
  if (newHistory.length > 10) {
    newHistory.shift();
  }

  return {
    ...gameState,
    history: newHistory
  };
};

// 回退功能
export const undoMove = (gameState: GameState): { success: boolean, newState?: GameState, message: string } => {
  if (gameState.history.length === 0) {
    return { success: false, message: '没有可回退的步骤' };
  }

  if (gameState.coins < COIN_COSTS.UNDO) {
    return { success: false, message: `虚拟币不足，需要${COIN_COSTS.UNDO}个虚拟币` };
  }

  const lastState = gameState.history[gameState.history.length - 1];
  const newHistory = gameState.history.slice(0, -1);
  const newCoins = gameState.coins - COIN_COSTS.UNDO;

  const newState: GameState = {
    board: lastState.board.map(row => [...row]),
    score: lastState.score,
    gameOver: false,
    won: gameState.won, // 保持胜利状态
    coins: newCoins,
    history: newHistory
  };

  saveCoins(newCoins);

  return { 
    success: true, 
    newState, 
    message: `回退成功，消耗${COIN_COSTS.UNDO}个虚拟币` 
  };
};

// 检查并奖励虚拟币
export const checkCoinRewards = (oldState: GameState, newState: GameState): { coins: number, messages: string[] } => {
  let bonusCoins = 0;
  const messages: string[] = [];

  // 分数里程碑奖励
  const oldMilestones = Math.floor(oldState.score / 1000);
  const newMilestones = Math.floor(newState.score / 1000);
  if (newMilestones > oldMilestones) {
    const milestoneReward = (newMilestones - oldMilestones) * COIN_REWARDS.SCORE_MILESTONE;
    bonusCoins += milestoneReward;
    messages.push(`达成${newMilestones * 1000}分里程碑！获得${milestoneReward}虚拟币`);
  }

  // 新数字成就奖励
  const oldMaxTile = getMaxTile(oldState.board);
  const newMaxTile = getMaxTile(newState.board);
  if (newMaxTile > oldMaxTile && newMaxTile >= 128) {
    bonusCoins += COIN_REWARDS.TILE_ACHIEVEMENT;
    messages.push(`达成${newMaxTile}数字成就！获得${COIN_REWARDS.TILE_ACHIEVEMENT}虚拟币`);
  }

  // 首次胜利奖励
  if (!oldState.won && newState.won) {
    bonusCoins += COIN_REWARDS.FIRST_WIN;
    messages.push(`首次达成2048！获得${COIN_REWARDS.FIRST_WIN}虚拟币`);
  }

  const finalCoins = newState.coins + bonusCoins;
  if (bonusCoins > 0) {
    saveCoins(finalCoins);
  }

  return { coins: finalCoins, messages };
};

// 获取棋盘上的最大数字
const getMaxTile = (board: number[][]): number => {
  let max = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] > max) {
        max = board[row][col];
      }
    }
  }
  return max;
};

// 每日签到奖励
export const claimDailyBonus = (gameState: GameState): { success: boolean, newCoins: number, message: string } => {
  const today = new Date().toDateString();
  const lastClaim = localStorage.getItem('2048-last-daily-claim');
  
  if (lastClaim === today) {
    return { success: false, newCoins: gameState.coins, message: '今日已签到' };
  }

  const newCoins = gameState.coins + COIN_REWARDS.DAILY_BONUS;
  localStorage.setItem('2048-last-daily-claim', today);
  saveCoins(newCoins);

  return { 
    success: true, 
    newCoins, 
    message: `每日签到成功！获得${COIN_REWARDS.DAILY_BONUS}虚拟币` 
  };
};