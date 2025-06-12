import React from 'react';
import { Button, Tooltip } from '@arco-design/web-react';
import { IconUndo, IconStar } from '@arco-design/web-react/icon';
import { COIN_COSTS } from '../gameLogic';
import './UndoButton.css';

interface UndoButtonProps {
  onUndo: () => void;
  disabled: boolean;
  coins: number;
  hasHistory: boolean;
}

const UndoButton: React.FC<UndoButtonProps> = ({ onUndo, disabled, coins, hasHistory }) => {
  const canAfford = coins >= COIN_COSTS.UNDO;
  const isDisabled = disabled || !hasHistory || !canAfford;
  
  const getTooltipContent = () => {
    if (!hasHistory) return '没有可回退的步骤';
    if (!canAfford) return `虚拟币不足，需要${COIN_COSTS.UNDO}个虚拟币`;
    return `消耗${COIN_COSTS.UNDO}个虚拟币回退一步`;
  };

  return (
    <Tooltip content={getTooltipContent()}>
      <Button
        type="outline"
        size="large"
        icon={<IconUndo />}
        onClick={onUndo}
        disabled={isDisabled}
        className={`undo-button ${isDisabled ? 'disabled' : 'enabled'}`}
      >
        <span className="undo-text">回退</span>
        <div className="coin-cost">
          <IconStar className="cost-icon" />
          <span>{COIN_COSTS.UNDO}</span>
        </div>
      </Button>
    </Tooltip>
  );
};

export default UndoButton;