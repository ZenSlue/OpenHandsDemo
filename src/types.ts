export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  board: number[][];
  score: number;
  gameOver: boolean;
  won: boolean;
  coins: number;
  history: GameHistoryState[];
}

export interface GameHistoryState {
  board: number[][];
  score: number;
  timestamp: number;
}

export interface Position {
  row: number;
  col: number;
}