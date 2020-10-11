import React, { FC, useState } from 'react';
import { rgbaToHex, rgbaToArray } from 'hex-and-rgba';

import { hexAlphaToRgba, getGradient } from '../../../utils';

interface IColor {
  gradient: string;
  type: string;
  modifier: any;
  stops: any;
}

type TProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  activeColor: any;
  setActiveColor: any;
};

const RADIALS_POS = [
  { pos: 'tl', css: 'circle at left top', active: false },
  { pos: 'tm', css: 'circle at center top', active: false },
  { pos: 'tr', css: 'circle at right top', active: false },
  { pos: 'r', css: 'circle at right', active: false },
  { pos: 'm', css: 'circle at center', active: true },
  { pos: 'l', css: 'circle at left', active: false },
  { pos: 'br', css: 'circle at right bottom', active: false },
  { pos: 'bm', css: 'circle at center bottom', active: false },
  { pos: 'bl', css: 'circle at left bottom', active: false },
];

const GradientPanel: FC<TProps> = ({ color, setColor, activeColor, setActiveColor }) => {
  const { stops, gradient, type, modifier } = color;

  const [radialsPosition, setRadialPosition] = useState(RADIALS_POS);

  const onClickMode = () => {
    switch (type) {
      case 'linear':
        const activePos = radialsPosition.find((item) => item.active);
        setColor({
          ...color,
          modifier: activePos && activePos.css,
          gradient: `${getGradient('radial', stops, activePos && activePos.css)}`,
          type: 'radial',
        });
        break;

      case 'radial':
        setColor({
          ...color,
          gradient: `${getGradient('linear', stops, 180)}`,
          type: 'linear',
        });
        break;

      default:
        break;
    }
  };

  const onAddColorStop = (e: any) => {
    if (e.target.className !== 'gradient-marker') {
      const rect = e.target.getBoundingClientRect();
      const clickPos = e.clientX - rect.left;
      const loc = Number(((100 / rect.width) * clickPos).toFixed(1)) / 100;
      const newStops = [...color.stops, [hexAlphaToRgba(activeColor), loc]].sort(
        (a: [string, number], b: [string, number]) => a[1] - b[1]
      );

      setColor({
        ...color,
        gradient: `${getGradient(type, newStops, modifier)}`,
        stops: newStops,
      });

      setActiveColor({
        ...activeColor,
        loc: loc,
      });
    }

    return;
  };

  const setActiveRadialPosition = (e: any) => {
    const pos = e.target.getAttribute('data-pos');
    const newRadialsPosition = radialsPosition.map((item) => {
      if (item.pos === pos) {
        return {
          ...item,
          active: true,
        };
      }

      return {
        ...item,
        active: false,
      };
    });

    setRadialPosition(newRadialsPosition);

    const activePos = newRadialsPosition.find((item) => item.active);
    setColor({
      ...color,
      modifier: activePos && activePos.css,
      gradient: `${getGradient('radial', stops, activePos && activePos.css)}`,
    });
  };

  const selectActiveColor = (rgba: string, position: number) => {
    const rgbaArray = rgbaToArray(rgba);
    const hex = rgbaToHex([rgbaArray[0], rgbaArray[1], rgbaArray[2]]);

    setActiveColor({
      hex,
      alpha: Number(rgbaArray[3]) * 100,
      loc: Number(position) / 100,
    });
  };

  return (
    <div className='gradient-interaction'>
      <div className='gradient-result' style={{ background: gradient }}>
        <div data-mode={type} className='gradient-mode' onClick={() => onClickMode()}></div>
        <div className='gradient-angle' style={{ visibility: type === 'linear' ? 'visible' : 'hidden' }}>
          <div style={{ transform: `rotate(${modifier - 90}deg)` }}></div>
        </div>
        <div
          className='gradient-pos'
          style={{ opacity: type === 'radial' ? '1' : '0', visibility: type === 'radial' ? 'visible' : 'hidden' }}
        >
          {radialsPosition.map((item) => {
            return (
              <div
                key={item.pos}
                data-pos={item.pos}
                className={item.active ? 'gradient-active' : ''}
                onClick={(e) => setActiveRadialPosition(e)}
              />
            );
          })}
        </div>
      </div>
      <div className='gradient-stops' onClick={(e) => onAddColorStop(e)}>
        <div
          className='gradient-stop-preview'
          style={{
            background: `linear-gradient(to right, ${stops
              .map((color: [string, number]) => `${color[0]} ${color[1] * 100}%`)
              .join(', ')})`,
          }}
        />
        <div className='gradient-stop-marker'>
          {stops.map((color: [string, number]) => {
            const position = color[1] * 100;
            const rgba = color[0];

            return (
              <div
                key={rgba + position}
                className='gradient-marker'
                style={{ left: position + '%', color: rgba }}
                onClick={() => selectActiveColor(rgba, position)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientPanel;
