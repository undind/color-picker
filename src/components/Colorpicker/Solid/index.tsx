import React, { FC, useEffect, useRef, useState } from 'react';

import ColorPickerPanel from '../ColorPanel';
import InputRgba from '../../InputRgba';

import { getHexAlpha, hexAlphaToRgba, useDebounce } from '../../../utils';

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

const ColorPickerSolid: FC<TProps> = ({
  value = '#ffffff',
  onChange = () => ({}),
  debounceMS = 300,
  debounce = true,
}) => {
  const node = useRef<HTMLDivElement | null>(null);

  const [init, setInit] = useState(true);
  const [color, setColor] = useState(getHexAlpha(value));
  useEffect(() => {
    setColor(getHexAlpha(value));
  }, [value]);

  const debounceColor = useDebounce(color, debounceMS);
  useEffect(() => {
    if (debounce && debounceColor && init === false) {
      const rgba = hexAlphaToRgba(color);
      onChange && onChange(rgba);
    } else if (init === false) {
      const rgba = hexAlphaToRgba(color);
      onChange && onChange(rgba);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  const onCompleteChange = (value: TPropsChange) => {
    setInit(false);
    setColor({
      hex: value.color,
      alpha: Math.round(value.alpha),
    });
  };

  return (
    <div ref={node} className='colorpicker'>
      <ColorPickerPanel
        hex={color.hex}
        alpha={color.alpha}
        onChange={(value: TPropsChange) => onCompleteChange(value)}
      />
      <InputRgba hex={color.hex} alpha={color.alpha} onChange={setColor} onSubmitChange={onChange} />
    </div>
  );
};

export default ColorPickerSolid;
