import React from 'react';
import { Typography, Button, Space, Card } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import './GameHeader.css';

const { Title, Text } = Typography;

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, bestScore, onRestart }) => {
  return (
    <div className="game-header">
      <div className="title-section">
        <Title heading={1} className="game-title">2048</Title>
        <Text className="game-subtitle">
          合并数字，达到2048！
        </Text>
      </div>
      
      <div className="score-section">
        <Space size="medium">
          <Card className="score-card">
            <div className="score-content">
              <Text className="score-label">分数</Text>
              <Text className="score-value">{score}</Text>
            </div>
          </Card>
          
          <Card className="score-card">
            <div className="score-content">
              <Text className="score-label">最高分</Text>
              <Text className="score-value">{bestScore}</Text>
            </div>
          </Card>
          
          <Button 
            type="primary" 
            icon={<IconRefresh />}
            onClick={onRestart}
            className="restart-button"
          >
            重新开始
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default GameHeader;