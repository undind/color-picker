import React, { FC } from 'react';

interface IColor {
  gradient: string;
  type: string;
  modifier: number;
  stops: any;
}

type TProps = {
  color: IColor;
  setColor: (color: IColor) => void;
};

const GradientPanel: FC<TProps> = ({ color, setColor }) => {
  console.log(color);
  const { stops, gradient, type, modifier } = color;
  console.log(gradient);

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

  return (
    <div className='gradient-interaction'>
      <div className='gradient-result' style={{ background: gradient }}>
        <div data-mode={type} className='gradient-mode' onClick={() => onClickMode()}></div>
        <div className='gradient-angle'>
          <div style={{ transform: `rotate(${modifier - 90}deg)` }}></div>
        </div>
        <div className='gradient-pos'>
          <div data-pos='tl'></div>
          <div data-pos='tm'></div>
          <div data-pos='tr'></div>
          <div data-pos='l'></div>
          <div data-pos='m'></div>
          <div data-pos='r'></div>
          <div data-pos='bl'></div>
          <div data-pos='bm'></div>
          <div data-pos='br'></div>
        </div>
      </div>
      <div className='gradient-stops'>
        <div
          className='gradient-stop-preview'
          style={{ background: 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)' }}
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
