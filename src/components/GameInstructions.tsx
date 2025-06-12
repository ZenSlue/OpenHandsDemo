import React from 'react';
import { Card, Typography, Space } from '@arco-design/web-react';
import './GameInstructions.css';

const { Text } = Typography;

const GameInstructions: React.FC = () => {
  return (
    <Card className="instructions-card">
      <Space direction="vertical" size="small">
        <Text className="instructions-title">游戏说明</Text>
        <Text className="instructions-text">
          使用方向键移动方块。当两个相同数字的方块碰撞时，它们会合并成一个！
        </Text>
        <div className="key-hints">
          <span className="key">↑</span>
          <span className="key">↓</span>
          <span className="key">←</span>
          <span className="key">→</span>
        </div>
      </Space>
    </Card>
  );
};

export default GameInstructions;