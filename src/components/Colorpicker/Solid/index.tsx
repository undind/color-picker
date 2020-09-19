import React, { FC, useEffect, useRef, useState } from 'react';
import './_colorpicker.scss';
import classNames from 'classnames';

import ColorPickerPanel from '../ColorPanel';
import InputRgba from '../../InputRgba';

import { getHexAlpha, hexAlphaToRgba, useDebounce } from '../../../utils';

type TPropsChange = {
  alpha: number;
  color: string;
};

type TProps = {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

const ColorPickerSolid: FC<TProps> = ({ value, onChange, onClose }) => {
  const node = useRef<HTMLDivElement | null>(null);

  const [init, setInit] = useState(true);
  const [color, setColor] = useState(getHexAlpha(value));
  useEffect(() => {
    setColor(getHexAlpha(value));
  }, [value]);

  const debounceColor = useDebounce(color, 300);
  useEffect(() => {
    if (debounceColor && init === false) {
      const rgba = hexAlphaToRgba(color);
      onChange && onChange(rgba);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  const onCompleteChange = (value: TPropsChange) => {
    setInit(false);
    setColor((prev) => {
      const isTransparent = prev.hex === '#ffffff' && prev.alpha === 0 && value.alpha === 0;
      return {
        hex: value.color,
        alpha: isTransparent ? 100 : Math.round(value.alpha),
      };
    });
  };

  return (
    <div ref={node} className={classNames('colorpicker')}>
      <ColorPickerPanel
        color={color.hex}
        alpha={color.alpha}
        onChange={(value: TPropsChange) => onCompleteChange(value)}
      />
      <InputRgba hex={color.hex} alpha={color.alpha} onChange={setColor} onSubmitChange={onChange} />
    </div>
  );
};

export default ColorPickerSolid;
