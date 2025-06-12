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
          使用方向键或鼠标拖拽移动方块。当两个相同数字的方块碰撞时，它们会合并成一个！
        </Text>
        <div className="control-hints">
          <div className="key-hints">
            <Text className="hint-label">键盘控制：</Text>
            <div className="keys">
              <span className="key">↑</span>
              <span className="key">↓</span>
              <span className="key">←</span>
              <span className="key">→</span>
            </div>
          </div>
          <div className="mouse-hints">
            <Text className="hint-label">鼠标/触摸：</Text>
            <Text className="hint-text">在棋盘上拖拽移动</Text>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default GameInstructions;