export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  board: number[][];
  score: number;
  gameOver: boolean;
  won: boolean;
}

export interface Position {
  row: number;
  col: number;
}