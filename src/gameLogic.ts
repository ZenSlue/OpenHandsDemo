import { Direction, GameState, Position } from './types';

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

export const initializeGame = (): GameState => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  
  return {
    board,
    score: 0,
    gameOver: false,
    won: false
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