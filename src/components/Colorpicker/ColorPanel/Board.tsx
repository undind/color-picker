import React, { FC, useEffect, useRef, MutableRefObject, MouseEvent } from 'react';

import { TinyColor } from '../../../utils';
import { TPropsComp, TCoords } from './types';

const WIDTH = 200;
const HEIGHT = 150;

const Board: FC<TPropsComp> = ({ rootPrefixCls, color, onChange }) => {
  const node = useRef() as MutableRefObject<HTMLDivElement>;

  const removeListeners = () => {
    window.removeEventListener('mousemove', onBoardDrag);
    window.removeEventListener('mouseup', onBoardDragEnd);
  };

  const removeTouchListeners = () => {
    window.addEventListener('touchmove', onBoardTouchMove);
    window.addEventListener('touchend', onBoardTouchEnd);
  };

  useEffect(() => {
    return () => {
      removeListeners();
      removeTouchListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBoardMouseDown = (e: MouseEvent) => {
    const buttons = e.buttons;

    if (buttons !== 1) return;

    removeListeners();

    const x = e.clientX;
    const y = e.clientY;
    pointMoveTo({ x, y });

    window.addEventListener('mousemove', onBoardDrag);
    window.addEventListener('mouseup', onBoardDragEnd);
  };

  const onBoardTouchStart = (e: any) => {
    if (e.touches.length !== 1) {
      return;
    }

    removeTouchListeners();

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;

    pointMoveTo({ x, y });

    window.addEventListener('touchmove', onBoardTouchMove);
    window.addEventListener('touchend', onBoardTouchEnd);
  };

  const onBoardTouchMove = (e: any) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    
    pointMoveTo({
      x,
      y,
    });
  };

  const onBoardTouchEnd = () => {
    removeTouchListeners();
  };

  const onBoardDrag = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });
  };

  const onBoardDragEnd = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    pointMoveTo({
      x,
      y,
    });
    removeListeners();
  };

  const getPrefixCls = () => {
    return `${rootPrefixCls}-board`;
  };

  const pointMoveTo = (pos: TCoords) => {
    const rect = node && node.current.getBoundingClientRect();
    let left = pos.x - rect.left;
    let top = pos.y - rect.top;

    const rWidth = rect.width || WIDTH;
    const rHeight = rect.height || HEIGHT;

    left = Math.max(0, left);
    left = Math.min(left, rWidth);
    top = Math.max(0, top);
    top = Math.min(top, rHeight);

    color.saturation = left / rWidth;
    color.brightness = 1 - top / rHeight;

    onChange(color);
  };

  const prefixCls = getPrefixCls();

  const hueHsv = {
    h: color.hue,
    s: 1,
    v: 1,
  };

  const hueColor = new TinyColor(hueHsv).toHexString();

  const xRel = color.saturation * 100;
  const yRel = (1 - color.brightness) * 100;

  return (
    <div className={prefixCls} ref={node}>
      <div className={`${prefixCls}-hsv`} style={{ backgroundColor: hueColor }}>
        <div className={`${prefixCls}-value`} />
        <div className={`${prefixCls}-saturation`} />
      </div>
      <span
        style={{
          left: `calc(${xRel}% - 7px)`,
          top: `calc(${yRel}% - 7px)`,
          backgroundColor: color.toHexString(),
        }}
      />

      <div className={`${prefixCls}-handler`} onMouseDown={onBoardMouseDown} onTouchStart={onBoardTouchStart} />
    </div>
  );
};

export default Board;
