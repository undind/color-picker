import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import addEventListener from './helpers/addEventListener';

import Color from './helpers/color';

const WIDTH = 200;
const HEIGHT = 150;

export default class Board extends React.Component {
  componentWillUnmount() {
    this.removeListeners();
    this.removeTouchListeners();
  }

  onBoardMouseDown = (e) => {
    const buttons = e.buttons;

    if (buttons !== 1) return;

    this.removeListeners();
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({ x, y });
    this.dragListener = addEventListener(window, 'mousemove', this.onBoardDrag);
    this.dragUpListener = addEventListener(window, 'mouseup', this.onBoardDragEnd);
  };

  onBoardTouchStart = (e) => {
    if (e.touches.length !== 1) {
      return;
    }
    this.removeTouchListeners();
    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    this.pointMoveTo({ x, y });
    this.touchMoveListener = addEventListener(window, 'touchmove', this.onBoardTouchMove);
    this.touchEndListener = addEventListener(window, 'touchend', this.onBoardTouchEnd);
  };

  onBoardTouchMove = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    this.pointMoveTo({
      x,
      y,
    });
  };

  onBoardTouchEnd = () => {
    this.removeTouchListeners();
  };

  onBoardDrag = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });
  };

  onBoardDragEnd = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });
    this.removeListeners();
  };

  getPrefixCls = () => {
    return `${this.props.rootPrefixCls}-board`;
  };

  removeTouchListeners = () => {
    if (this.touchMoveListener) {
      this.touchMoveListener.remove();
      this.touchMoveListener = null;
    }
    if (this.touchEndListener) {
      this.touchEndListener.remove();
      this.touchEndListener = null;
    }
  };

  removeListeners = () => {
    if (this.dragListener) {
      this.dragListener.remove();
      this.dragListener = null;
    }
    if (this.dragUpListener) {
      this.dragUpListener.remove();
      this.dragUpListener = null;
    }
  };

  pointMoveTo = (pos) => {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    let left = pos.x - rect.left;
    let top = pos.y - rect.top;

    const rWidth = rect.width || WIDTH;
    const rHeight = rect.height || HEIGHT;

    left = Math.max(0, left);
    left = Math.min(left, rWidth);
    top = Math.max(0, top);
    top = Math.min(top, rHeight);

    const { color } = this.props;

    color.saturation = left / rWidth;
    color.brightness = 1 - top / rHeight;

    this.props.onChange(color);
  };

  render() {
    const prefixCls = this.getPrefixCls();
    const color = this.props.color;

    const hueHsv = {
      h: color.hue,
      s: 1,
      v: 1,
    };

    const hueColor = new Color(hueHsv).toHexString();

    const xRel = color.saturation * 100;
    const yRel = (1 - color.brightness) * 100;

    return (
      <div className={prefixCls}>
        <div className={`${prefixCls}-hsv`} style={{ backgroundColor: hueColor }}>
          <div className={`${prefixCls}-value`} />
          <div className={`${prefixCls}-saturation`} />
        </div>
        <span style={{ left: `calc(${xRel}% - 7px)`, top: `calc(${yRel}% - 7px)`, backgroundColor: this.props.color.toHexString() }} />

        <div
          className={`${prefixCls}-handler`}
          onMouseDown={this.onBoardMouseDown}
          onTouchStart={this.onBoardTouchStart}
        />
      </div>
    );
  }
}

Board.propTypes = {
  color: PropTypes.object,
  onChange: PropTypes.func,
  rootPrefixCls: PropTypes.string,
};
