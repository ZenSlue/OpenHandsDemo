import React from 'react';
import { Button, Space, Tooltip } from '@arco-design/web-react';
import { IconStar, IconGift } from '@arco-design/web-react/icon';
import './CoinDisplay.css';

interface CoinDisplayProps {
  coins: number;
  onDailyBonus: () => void;
  canClaimDaily: boolean;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ coins, onDailyBonus, canClaimDaily }) => {
  return (
    <div className="coin-display">
      <Space size="small" align="center">
        <div className="coin-amount">
          <IconStar className="coin-icon" />
          <span className="coin-number">{coins}</span>
        </div>
        
        <Tooltip content={canClaimDaily ? "点击领取每日奖励" : "今日已签到"}>
          <Button
            type="primary"
            size="small"
            icon={<IconGift />}
            onClick={onDailyBonus}
            disabled={!canClaimDaily}
            className={`daily-bonus-btn ${canClaimDaily ? 'available' : 'claimed'}`}
          >
            {canClaimDaily ? '签到' : '已签'}
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};

export default CoinDisplay;