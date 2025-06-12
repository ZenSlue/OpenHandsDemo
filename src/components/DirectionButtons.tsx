import React from 'react';
import { Button, Space } from '@arco-design/web-react';
import { IconUp, IconDown, IconLeft, IconRight } from '@arco-design/web-react/icon';
import { Direction } from '../types';
import './DirectionButtons.css';

interface DirectionButtonsProps {
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}

const DirectionButtons: React.FC<DirectionButtonsProps> = ({ onMove, disabled = false }) => {
  return (
    <div className="direction-buttons">
      <div className="direction-buttons-container">
        {/* 上方向键 */}
        <div className="direction-row">
          <Button
            type="outline"
            icon={<IconUp />}
            onClick={() => onMove('up')}
            disabled={disabled}
            className="direction-button up-button"
            size="large"
          />
        </div>
        
        {/* 左右方向键 */}
        <div className="direction-row">
          <Button
            type="outline"
            icon={<IconLeft />}
            onClick={() => onMove('left')}
            disabled={disabled}
            className="direction-button left-button"
            size="large"
          />
          <div className="direction-spacer" />
          <Button
            type="outline"
            icon={<IconRight />}
            onClick={() => onMove('right')}
            disabled={disabled}
            className="direction-button right-button"
            size="large"
          />
        </div>
        
        {/* 下方向键 */}
        <div className="direction-row">
          <Button
            type="outline"
            icon={<IconDown />}
            onClick={() => onMove('down')}
            disabled={disabled}
            className="direction-button down-button"
            size="large"
          />
        </div>
      </div>
      
      <div className="direction-hint">
        <span>点击方向键或拖拽棋盘来移动方块</span>
      </div>
    </div>
  );
};

export default DirectionButtons;