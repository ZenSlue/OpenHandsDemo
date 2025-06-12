import React from 'react';
import { Card } from '@arco-design/web-react';
import { useSwipe } from '../hooks/useSwipe';
import { Direction } from '../types';
import './GameBoard.css';

interface GameBoardProps {
  board: number[][];
  onMove: (direction: Direction) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onMove }) => {
  const swipeHandlers = useSwipe({ onSwipe: onMove });

  const getTileClass = (value: number): string => {
    if (value === 0) return 'tile tile-empty';
    return `tile tile-${value}`;
  };

  const getTileValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  return (
    <Card className="game-board">
      <div 
        className="board-grid"
        {...swipeHandlers}
        style={{ cursor: 'grab' }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getTileClass(cell)}
            >
              <span className="tile-value">{getTileValue(cell)}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default GameBoard;