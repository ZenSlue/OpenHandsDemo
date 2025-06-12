import React from 'react';
import { Card } from '@arco-design/web-react';
import './GameBoard.css';

interface GameBoardProps {
  board: number[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  const getTileClass = (value: number): string => {
    if (value === 0) return 'tile tile-empty';
    return `tile tile-${value}`;
  };

  const getTileValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  return (
    <Card className="game-board">
      <div className="board-grid">
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