import { useRef, useCallback } from 'react';
import { Direction } from '../types';

interface SwipeHandlers {
  onSwipe: (direction: Direction) => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

export const useSwipe = ({ onSwipe }: SwipeHandlers) => {
  const touchStart = useRef<TouchPosition | null>(null);
  const mouseStart = useRef<TouchPosition | null>(null);
  const isDragging = useRef(false);

  const getDirection = useCallback((startPos: TouchPosition, endPos: TouchPosition): Direction | null => {
    const deltaX = endPos.x - startPos.x;
    const deltaY = endPos.y - startPos.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return null;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    const direction = getDirection(touchStart.current, endPos);

    if (direction) {
      onSwipe(direction);
    }

    touchStart.current = null;
  }, [getDirection, onSwipe]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStart.current = { x: e.clientX, y: e.clientY };
    isDragging.current = true;
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!mouseStart.current || !isDragging.current) return;

    const endPos = { x: e.clientX, y: e.clientY };
    const direction = getDirection(mouseStart.current, endPos);

    if (direction) {
      onSwipe(direction);
    }

    mouseStart.current = null;
    isDragging.current = false;
  }, [getDirection, onSwipe]);

  const handleMouseLeave = useCallback(() => {
    mouseStart.current = null;
    isDragging.current = false;
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
};