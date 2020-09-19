import React, { useState, useRef, useEffect } from 'react';
import typeColor from './utils/validationColor';
import PropTypes from 'prop-types';

import Color from './helpers/color';

import Board from './Board';
import Ribbon from './Ribbon';
import Alpha from './Alpha';

import classNames from 'classnames';

const Panel = ({ alpha, className, color, defaultAlpha, defaultColor, onChange, prefixCls }) => {
  const node = useRef(null);

  const alphaConvert = typeof alpha === 'undefined' ? defaultAlpha : alpha;
  const colorConvert = new Color(color || defaultColor);
  const [state, setState] = useState({
    color: colorConvert,
    alpha: alphaConvert,
  });

  useEffect(() => {
    setState({
      color: colorConvert,
      alpha: alphaConvert,
    });
  }, [color, alpha]);

  const wrapClasses = classNames({
    [`${prefixCls}-wrap`]: true,
    [`${prefixCls}-wrap-has-alpha`]: true,
  });

  const handleAlphaChange = (alpha) => {
    const { color } = state;
    color.alpha = alpha;

    setState({
      alpha,
      color,
    });
    onChange({
      color: color.toHexString(),
      alpha,
    });
  };

  const handleChange = (color) => {
    const { alpha } = state;
    color.alpha = alpha;

    setState({ ...state, color, alpha: color.alpha });
    onChange({
      color: color.toHexString(),
      alpha: color.alpha,
    });
  };

  return (
    <div ref={node} className={[prefixCls, className].join(' ')} tabIndex='0'>
      <div className={`${prefixCls}-inner`}>
        <Board rootPrefixCls={prefixCls} color={state.color} onChange={handleChange} />
        <div className={wrapClasses}>
          <div className={`${prefixCls}-wrap-ribbon`}>
            <Ribbon rootPrefixCls={prefixCls} color={state.color} onChange={handleChange} />
          </div>
          <div className={`${prefixCls}-wrap-alpha`}>
            <Alpha rootPrefixCls={prefixCls} alpha={state.alpha} color={state.color} onChange={handleAlphaChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

Panel.propTypes = {
  alpha: PropTypes.number,
  className: PropTypes.string,
  color: typeColor,
  defaultAlpha: PropTypes.number,
  defaultColor: typeColor,
  onChange: PropTypes.func,
  prefixCls: PropTypes.string,
};

Panel.defaultProps = {
  className: '',
  defaultAlpha: 100,
  defaultColor: '#ff0000',
  onChange: () => ({}),
  prefixCls: 'rc-color-picker-panel',
};

export default Panel;
