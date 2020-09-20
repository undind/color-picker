import React, { FC, useState, useRef, useEffect, MutableRefObject } from 'react';
import classNames from 'classnames';

import Board from './Board';
import Ribbon from './Ribbon';
import Alpha from './Alpha';

import { TinyColor } from '../../../utils';
import { TPropsMain } from './types';

const Panel: FC<TPropsMain> = ({ alpha, className, color, onChange }) => {
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
    [`color-picker-panel-wrap`]: true,
    [`color-picker-panel-wrap-has-alpha`]: true,
  });

  const handleAlphaChange = (alpha: number) => {
    const { color } = state;
    color.alpha = alpha;

    setState({
      color,
      alpha,
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
    <div ref={node} className={['color-picker-panel', className].join(' ')} tabIndex={0}>
      <div className='color-picker-panel-inner'>
        <Board rootPrefixCls='color-picker-panel' color={state.color} onChange={handleChange} />
        <div className={wrapClasses}>
          <div className='color-picker-panel-wrap-ribbon'>
            <Ribbon rootPrefixCls='color-picker-panel' color={state.color} onChange={handleChange} />
          </div>
          <div className='color-picker-panel-wrap-alpha'>
            <Alpha
              rootPrefixCls='color-picker-panel'
              alpha={state.alpha}
              color={state.color}
              onChange={handleAlphaChange}
            />
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
};

export default Panel;
