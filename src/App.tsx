import React, { useState, useEffect, useCallback } from 'react';
import { Message } from '@arco-design/web-react';
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import GameOverModal from './components/GameOverModal';
import GameInstructions from './components/GameInstructions';
import DirectionButtons from './components/DirectionButtons';
import UndoButton from './components/UndoButton';
import { GameState, Direction } from './types';
import { 
  initializeGame, 
  move, 
  addRandomTile, 
  isGameOver, 
  hasWon, 
  addToHistory,
  undoMove,
  checkCoinRewards,
  claimDailyBonus
} from './gameLogic';
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

    // 先保存当前状态到历史记录
    const stateWithHistory = addToHistory(gameState);

    const result = move(gameState.board, direction);
    
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      const newScore = gameState.score + result.score;
      const gameOver = isGameOver(newBoard);
      const won = hasWon(newBoard);

      const newState: GameState = {
        board: newBoard,
        score: newScore,
        gameOver,
        won: won || gameState.won,
        coins: gameState.coins,
        history: stateWithHistory.history
      };

      // 检查虚拟币奖励
      const coinReward = checkCoinRewards(gameState, newState);
      newState.coins = coinReward.coins;

      setGameState(newState);

      if (result.score > 0) {
        Message.success(`+${result.score} 分！`);
      }

      // 显示虚拟币奖励消息
      coinReward.messages.forEach(message => {
        Message.success(message);
      });
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

  const handleUndo = useCallback(() => {
    const result = undoMove(gameState);
    if (result.success && result.newState) {
      setGameState(result.newState);
      Message.success(result.message);
    } else {
      Message.error(result.message);
    }
  }, [gameState]);

  const handleDailyBonus = useCallback(() => {
    const result = claimDailyBonus(gameState);
    if (result.success) {
      setGameState(prev => ({ ...prev, coins: result.newCoins }));
      Message.success(result.message);
    } else {
      Message.info(result.message);
    }
  }, [gameState]);

  const canClaimDaily = useCallback(() => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('2048-last-daily-claim');
    return lastClaim !== today;
  }, []);

  return (
    <div className="app">
      <div className="game-container">
        <div className="game-header-section">
          <GameHeader 
            score={gameState.score}
            bestScore={bestScore}
            coins={gameState.coins}
            onRestart={handleRestart}
            onDailyBonus={handleDailyBonus}
            canClaimDaily={canClaimDaily()}
          />
        </div>
        
        <div className="game-board-section">
          <GameBoard board={gameState.board} onMove={handleMove} />
        </div>
        
        <div className="game-controls-section">
          <div className="controls-row">
            <DirectionButtons onMove={handleMove} disabled={gameState.gameOver} />
            <UndoButton 
              onUndo={handleUndo}
              disabled={gameState.gameOver}
              coins={gameState.coins}
              hasHistory={gameState.history.length > 0}
            />
          </div>
        </div>
        
        <div className="game-instructions-section">
          <GameInstructions />
        </div>
        
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