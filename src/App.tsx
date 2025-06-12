import React, { useState, useEffect, useCallback } from 'react';
import { Space, Message } from '@arco-design/web-react';
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import GameOverModal from './components/GameOverModal';
import GameInstructions from './components/GameInstructions';
import DirectionButtons from './components/DirectionButtons';
import { GameState, Direction } from './types';
import { initializeGame, move, addRandomTile, isGameOver, hasWon } from './gameLogic';
import './App.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showModal, setShowModal] = useState(false);
  const [hasShownWinModal, setHasShownWinModal] = useState(false);

  // Save best score to localStorage
  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
      localStorage.setItem('2048-best-score', gameState.score.toString());
    }
  }, [gameState.score, bestScore]);

  // Check for game over or win conditions
  useEffect(() => {
    if (gameState.won && !hasShownWinModal) {
      setShowModal(true);
      setHasShownWinModal(true);
    } else if (gameState.gameOver) {
      setShowModal(true);
    }
  }, [gameState.gameOver, gameState.won, hasShownWinModal]);

  const handleMove = useCallback((direction: Direction) => {
    if (gameState.gameOver) return;

    const result = move(gameState.board, direction);
    
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      const newScore = gameState.score + result.score;
      const gameOver = isGameOver(newBoard);
      const won = hasWon(newBoard);

      setGameState({
        board: newBoard,
        score: newScore,
        gameOver,
        won: won || gameState.won
      });

      if (result.score > 0) {
        Message.success(`+${result.score} 分！`);
      }
    }
  }, [gameState]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    switch (event.key) {
      case 'ArrowUp':
        handleMove('up');
        break;
      case 'ArrowDown':
        handleMove('down');
        break;
      case 'ArrowLeft':
        handleMove('left');
        break;
      case 'ArrowRight':
        handleMove('right');
        break;
    }
  }, [handleMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleRestart = () => {
    setGameState(initializeGame());
    setShowModal(false);
    setHasShownWinModal(false);
    Message.info('游戏重新开始！');
  };

  const handleContinue = () => {
    setShowModal(false);
  };

  return (
    <div className="app">
      <div className="game-container">
        <GameHeader 
          score={gameState.score}
          bestScore={bestScore}
          onRestart={handleRestart}
        />
        
        <Space direction="vertical" size="medium" align="center">
          <GameBoard board={gameState.board} onMove={handleMove} />
          <GameInstructions />
        </Space>
        
        <GameOverModal
          visible={showModal}
          won={gameState.won}
          score={gameState.score}
          onRestart={handleRestart}
          onContinue={gameState.won ? handleContinue : undefined}
        />
      </div>
    </div>
  );
};

export default App;