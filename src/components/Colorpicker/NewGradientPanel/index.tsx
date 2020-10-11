import React, { FC, useState } from 'react';

import { hexAlphaToRgba } from '../../../utils';

interface IColor {
  gradient: string;
  type: string;
  modifier: number;
  stops: any;
}

type TProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  activeColor: any;
  setActiveColor: any;
};

const RADIALS_POS = [
  { pos: 'tl', active: false },
  { pos: 'tm', active: false },
  { pos: 'tr', active: false },
  { pos: 'l', active: false },
  { pos: 'm', active: false },
  { pos: 'r', active: false },
  { pos: 'bl', active: false },
  { pos: 'bm', active: false },
  { pos: 'br', active: false },
];

const GradientPanel: FC<TProps> = ({ color, setColor, activeColor, setActiveColor }) => {
  const { stops, gradient, type, modifier } = color;

  const [radialsPosition, setRadialPosition] = useState(RADIALS_POS);

  const onClickMode = () => {
    switch (type) {
      case 'linear':
        setColor({
          ...color,
          type: 'radial',
        });
        break;

      case 'radial':
        setColor({
          ...color,
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

      setColor({
        ...color,
        stops: [...color.stops, [hexAlphaToRgba(activeColor), loc]].sort(
          (a: [string, number], b: [string, number]) => a[1] - b[1]
        ),
      });
    }
  };

  const setActiveRadialPosition = (e: any) => {
    const pos = e.target.getAttribute('data-pos');

    setRadialPosition((prevState) => {
      return prevState.map((item) => {
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
              <div key={rgba + position} className='gradient-marker' style={{ left: position + '%', color: rgba }} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientPanel;
