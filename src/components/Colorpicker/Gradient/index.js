import React, { useEffect, useRef, useState } from 'react';
import './_color_picker_gradient.scss';
import classNames from 'classnames';
import { rgbaToAHex, rgbaToArray } from 'hex-and-rgba';
import InputRgba from '../../InputRgba';
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';

import { hexAlphaToRgba, parseGradient } from './helper';

import GradientPicker from '../GradientPanel';

const GradientColorPicker = ({ value, onChange, onClose }) => {
  const node = useRef();

  const [gpickr, setGpickr] = useState();
  const [angle, setAngle] = useState(parseGradient(value).modifier);
  const [mode, setMode] = useState(parseGradient(value).type);
  const [activeColor, setActiveColor] = useState({
    hex: '#fffff',
    alpha: 100,
  });

  const [color, setColor] = useState(parseGradient(value));
  const [debounceColor] = useDebounce(color, 300);
  useEffect(() => {
    if (debounceColor.gradient) {
      onChange(debounceColor.gradient);
    }
  }, [debounceColor]);

  useEffect(() => {
    setColor({
      ...color,
      ...parseGradient(value),
    });
  }, [value]);

  const onChangeInputs = (value) => {
    gpickr._setPickrColor(hexAlphaToRgba(value));

    const stops = gpickr.getStops().map((item) => {
      return [item.color, item.location];
    });

    setColor({
      ...color,
      gradient: gpickr.getGradient(),
      stops,
    });
  };

  const onGradientChange = (gpickr) => {
    const rgbaArray = rgbaToArray(gpickr._focusedStop.color);
    setActiveColor({
      hex: rgbaToAHex(rgbaArray[0], rgbaArray[1], rgbaArray[2]),
      alpha: parseInt(rgbaArray[3] * 100, 10),
    });

    const stops = gpickr.getStops().map((item) => {
      return [item.color, item.location];
    });

    setColor({
      ...color,
      stops,
      gradient: gpickr.getGradient(),
    });
  };

  return (
    <div ref={node} className={classNames('sommerce-editor__elements-colorpicker-gradient')}>
      <div className='sommerce-editor__elements-colorpicker-gradient-inputs'>
        <InputRgba
          hex={activeColor.hex}
          alpha={activeColor.alpha}
          onChange={(value) => onChangeInputs(value)}
          onSubmitChange={false}
        />
      </div>
      <GradientPicker
        onChange={onGradientChange}
        stops={color.stops}
        angle={angle}
        setAngle={setAngle}
        mode={mode}
        setMode={setMode}
        cssString={value}
        gpickr={gpickr}
        setGpickr={setGpickr}
      />
    </div>
  );
};

GradientColorPicker.defaultProps = {
  value: {
    stops: [
      ['rgb(0,0,0)', 0],
      ['rgb(255,255,255)', 1],
    ],
    gradient: false,
  },
};

GradientColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default GradientColorPicker;
