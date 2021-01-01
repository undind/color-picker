import React, { FC, useEffect, useState, ReactText } from 'react';

import ColorPanel from '../ColorPanel';
import InputRgba from '../../InputRgba';
import GradientPanel from '../GradientPanel';

import { parseGradient, useDebounce, hexAlphaToRgba, getGradient, rgbaToArray, rgbaToHex } from '../../../utils';

type TPropsChange = {
  alpha: number;
  hex: string;
};

type TProps = {
  value?: string;
  onChange?: (value: string) => void;
  debounceMS?: number;
  debounce?: boolean;
  showAlpha?: boolean;
};

export interface IActiveColor {
  hex: string;
  alpha: number;
  loc: ReactText;
  index: ReactText;
}

const Gradient: FC<TProps> = ({
  value = '#ffffff',
  onChange = () => ({}),
  debounceMS = 300,
  debounce = true,
  showAlpha = true,
}) => {
  const lastStop = rgbaToArray(parseGradient(value).stops[parseGradient(value).stops.length - 1][0]);
  const lastStopLoc = parseGradient(value).stops[parseGradient(value).stops.length - 1][1];
  const activeStop = rgbaToHex([lastStop[0], lastStop[1], lastStop[2]]);
  const activeIdx = parseGradient(value).stops[parseGradient(value).stops.length - 1][2];

  const [init, setInit] = useState(true);
  const [activeColor, setActiveColor] = useState<IActiveColor>({
    hex: activeStop,
    alpha: Number(Math.round(lastStop[3] * 100)),
    loc: lastStopLoc,
    index: activeIdx,
  });

  const [color, setColor] = useState(parseGradient(value));
  const debounceColor = useDebounce(color, debounceMS);

  useEffect(() => {
    if (debounce && debounceColor && init === false) {
      onChange && onChange(debounceColor.gradient);
    } else if (init === false) {
      onChange && onChange(debounceColor.gradient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  const onChangeActiveColor = (value: TPropsChange) => {
    setInit(false);
    setActiveColor({
      ...activeColor,
      hex: value.hex,
      alpha: Number(Math.round(value.alpha)),
    });

    const { stops, type, modifier } = color;
    const rgba = hexAlphaToRgba(value);
    const newStops = stops.map((item) => {
      if (item[2] === activeColor.index) {
        return [rgba, item[1], item[2]];
      }
      return item;
    });
    setColor({
      ...color,
      gradient: `${getGradient(type, newStops, modifier)}`,
      stops: newStops,
    });
  };

  const onSubmitChange = (rgba: string) => {
    const rgbaArr = rgbaToArray(rgba);
    const hex = rgbaToHex([rgbaArr[0], rgbaArr[1], rgbaArr[2]]);
    onChangeActiveColor({ hex, alpha: rgbaArr[3] * 100 });
  };

  return (
    <div className='colorpicker'>
      <ColorPanel
        hex={activeColor.hex}
        alpha={activeColor.alpha}
        showAlpha={showAlpha}
        onChange={onChangeActiveColor}
      />
      <InputRgba
        hex={activeColor.hex}
        alpha={activeColor.alpha}
        showAlpha={showAlpha}
        onChange={(value) => setActiveColor((prev) => ({ ...prev, hex: value.hex, alpha: value.alpha }))}
        onSubmitChange={onSubmitChange}
      />
      <GradientPanel
        color={color}
        setColor={setColor}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        setInit={setInit}
      />
    </div>
  );
};

export default Gradient;
