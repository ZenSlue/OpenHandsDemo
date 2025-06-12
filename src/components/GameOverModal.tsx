import React from 'react';
import { Modal, Button, Typography, Space } from '@arco-design/web-react';
import { IconRefresh, IconTrophy } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

interface GameOverModalProps {
  visible: boolean;
  won: boolean;
  score: number;
  onRestart: () => void;
  onContinue?: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  visible, 
  won, 
  score, 
  onRestart, 
  onContinue 
}) => {
  return (
    <Modal
      title={null}
      visible={visible}
      footer={null}
      closable={false}
      style={{ textAlign: 'center' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {won ? (
          <IconTrophy style={{ fontSize: 64, color: '#f59563' }} />
        ) : (
          <div style={{ fontSize: 64 }}>😢</div>
        )}
        
        <Title heading={2} style={{ margin: 0, color: won ? '#f59563' : '#776e65' }}>
          {won ? '恭喜你赢了！' : '游戏结束'}
        </Title>
        
        <Text style={{ fontSize: 16, color: '#776e65' }}>
          {won ? '你成功达到了2048！' : '没有更多可移动的方块了'}
        </Text>
        
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#776e65' }}>
          最终分数: {score}
        </Text>
        
        <Space size="medium">
          <Button 
            type="primary" 
            icon={<IconRefresh />}
            onClick={onRestart}
            size="large"
          >
            重新开始
          </Button>
          
          {won && onContinue && (
            <Button 
              onClick={onContinue}
              size="large"
            >
              继续游戏
            </Button>
          )}
        </Space>
      </Space>
    </Modal>
  );
};

export default GameOverModal;