import React, { FC, useEffect, useRef, useState } from 'react';
import './_colorpicker.scss';
import ColorPickerPanel from '../ColorPanel';
import classNames from 'classnames';
import { getHexAlpha, hexAlphaToRgba, useDebounce } from '../../../utils';
import InputRgba from '../../InputRgba';

type TProps = {
  value: string;
  onChange: (value: any) => void;
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

  const outSideClick = (e: any) => {
    if (node.current && !node.current.contains(e.target)) {
      onClose();
      document.removeEventListener('mousedown', outSideClick);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', outSideClick);

    return () => {
      document.removeEventListener('mousedown', outSideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCompleteChange = (value: any) => {
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
      <ColorPickerPanel color={color.hex} alpha={color.alpha} onChange={(value: any) => onCompleteChange(value)} />
      <InputRgba hex={color.hex} alpha={color.alpha} onChange={setColor} onSubmitChange={onChange} />
    </div>
  );
};

export default ColorPickerSolid;
