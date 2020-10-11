import React, { FC, useEffect, useState } from 'react';
import { rgbaToHex, rgbaToArray } from 'hex-and-rgba';

import ColorPanel from '../ColorPanel';
import InputRgba from '../../InputRgba';
import GradientPanel from '../NewGradientPanel';

import { parseGradient, useDebounce } from '../../../utils';

import { TPropsChange } from '../ColorPanel/types';

type TProps = {
  value?: string;
  onChange?: (value: string) => void;
  debounceMS?: number;
  debounce?: boolean;
};

const Gradient: FC<TProps> = ({ value = '#ffffff', onChange = () => ({}), debounceMS = 300, debounce = true }) => {
  const lastStop = rgbaToArray(parseGradient(value).stops[parseGradient(value).stops.length - 1][0]);
  const lastStopLoc = parseGradient(value).stops[parseGradient(value).stops.length - 1][1];
  const activeStop = rgbaToHex([lastStop[0], lastStop[1], lastStop[2]]);

  const [init, setInit] = useState(true);
  const [activeColor, setActiveColor] = useState({
    hex: activeStop,
    alpha: Number(lastStop[3]) * 100,
    loc: lastStopLoc,
  });

  const [color, setColor] = useState(parseGradient(value));
  // useEffect(() => {
  //   setColor({
  //     ...color,
  //     ...parseGradient(value),
  //   });
  // }, [value]);

  const debounceColor = useDebounce(color, debounceMS);
  useEffect(() => {
    if (debounce && debounceColor && init === false) {
      onChange && onChange(debounceColor.gradient);
    } else if (init === false) {
      onChange && onChange(debounceColor.gradient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  const onChangeInputs = (value: TPropsChange) => {
    setInit(false);
    setActiveColor({
      ...activeColor,
      hex: value.hex,
      alpha: value.alpha,
    });
  };

  const onChangeActiveColor = (value: TPropsChange) => {
    setInit(false);
    setActiveColor({
      ...activeColor,
      hex: value.hex,
      alpha: value.alpha,
    });
  };

  return (
    <div className='colorpicker'>
      <ColorPanel hex={activeColor.hex} alpha={activeColor.alpha} onChange={(value) => onChangeActiveColor(value)} />
      <InputRgba hex={activeColor.hex} alpha={activeColor.alpha} onChange={(value) => onChangeInputs(value)} />
      <GradientPanel color={color} setColor={setColor} activeColor={activeColor} setActiveColor={setActiveColor} />
    </div>
  );
};

export default Gradient;
