import React, { FC, useState, useRef, useEffect, MutableRefObject } from 'react';
import classNames from 'classnames';

import Board from './Board';
import Ribbon from './Ribbon';
import Alpha from './Alpha';

import { TinyColor } from '../../../utils';
import { TPropsMain } from './types';

const Panel: FC<TPropsMain> = ({ alpha, className, color, onChange, prefixCls }) => {
  const node = useRef() as MutableRefObject<HTMLDivElement>;

  const colorConvert = new TinyColor(color);
  const [state, setState] = useState({
    color: colorConvert,
    alpha,
  });

  useEffect(() => {
    setState({
      color: colorConvert,
      alpha,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, alpha]);

  const wrapClasses = classNames({
    [`${prefixCls}-wrap`]: true,
    [`${prefixCls}-wrap-has-alpha`]: true,
  });

  const handleAlphaChange = (alpha: number) => {
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

  const handleChange = (color: any) => {
    const { alpha } = state;
    color.alpha = alpha;

    setState({ ...state, color, alpha: color.alpha });
    onChange({
      color: color.toHexString(),
      alpha: color.alpha,
    });
  };

  return (
    <div ref={node} className={[prefixCls, className].join(' ')} tabIndex={0}>
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

Panel.defaultProps = {
  className: '',
  alpha: 100,
  color: '#ff0000',
  onChange: () => ({}),
  prefixCls: 'rc-color-picker-panel',
};

export default Panel;
