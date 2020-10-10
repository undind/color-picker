import React, { FC, useEffect, useState } from 'react';

import ColorPanel from '../ColorPanel';
import InputRgba from '../../InputRgba';
import GradientPanel from '../NewGradientPanel';

import { parseGradient, useDebounce } from '../../../utils';

type TPropsChange = {
  alpha: number;
  color: string;
};

type TProps = {
  value?: string;
  onChange?: (value: string) => void;
  debounceMS?: number;
  debounce?: boolean;
};

const Gradient: FC<TProps> = ({ value = '#ffffff', onChange = () => ({}), debounceMS = 300, debounce = true }) => {
  const [init, setInit] = useState(true);
  const [activeColor, setActiveColor] = useState({
    hex: '#ffffff',
    alpha: 100,
  });

  const [color, setColor] = useState(parseGradient(value));
  useEffect(() => {
    setColor({
      ...color,
      ...parseGradient(value),
    });
  }, [value]);

  const debounceColor = useDebounce(color, debounceMS);
  useEffect(() => {
    if (debounce && debounceColor && init === false) {
      onChange && onChange(debounceColor.gradient);
    } else if (init === false) {
      onChange && onChange(debounceColor.gradient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  const onChangeInputs = (value: any) => {
    setInit(false);
    console.log(value);
  };

  const onChangeActiveColor = (value: TPropsChange) => {
    setInit(false);
    console.log(value);
  };

  return (
    <div className='colorpicker'>
      <ColorPanel
        hex={activeColor.hex}
        alpha={activeColor.alpha}
        onChange={(value: TPropsChange) => onChangeActiveColor(value)}
      />
      <InputRgba hex={activeColor.hex} alpha={activeColor.alpha} onChange={(value) => onChangeInputs(value)} />
      <GradientPanel color={color} setColor={setColor} />
    </div>
  );
};

export default Gradient;
