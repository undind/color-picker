import React, { FC, useState, useEffect, useRef, MutableRefObject, MouseEvent, Dispatch, SetStateAction } from 'react';

import { hexAlphaToRgba, getGradient, rgbaToArray, rgbaToHex } from '../../../utils';

import { IActiveColor } from '../Gradient';

type TCoords = {
  x: number;
  y: number;
  shiftKey?: number;
  ctrlKey?: number;
};

interface IColor {
  gradient: string;
  type: string;
  modifier: string | number | undefined;
  stops: any;
}

type TProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  activeColor: IActiveColor;
  setActiveColor: Dispatch<SetStateAction<IActiveColor>>;
  setInit: Dispatch<SetStateAction<boolean>>;
};

const RADIALS_POS = [
  { pos: 'tl', css: 'circle at left top', active: false },
  { pos: 'tm', css: 'circle at center top', active: false },
  { pos: 'tr', css: 'circle at right top', active: false },

  { pos: 'l', css: 'circle at left', active: false },
  { pos: 'm', css: 'circle at center', active: true },
  { pos: 'r', css: 'circle at right', active: false },

  { pos: 'bl', css: 'circle at left bottom', active: false },
  { pos: 'bm', css: 'circle at center bottom', active: false },
  { pos: 'br', css: 'circle at right bottom', active: false },
];

const GradientPanel: FC<TProps> = ({ color, setColor, activeColor, setActiveColor, setInit }) => {
  const node = useRef() as MutableRefObject<HTMLDivElement>;
  const angleNode = useRef() as MutableRefObject<HTMLDivElement>;

  const { stops, gradient, type, modifier } = color;

  const [radialsPosition, setRadialPosition] = useState(RADIALS_POS);
  const [activeLoc, setActiveLoc] = useState(activeColor.loc);
  const [activeIndex, setActiveIndex] = useState(activeColor.index);

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

  const onAddColorStop = (e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;

    if (target.className !== 'gradient-marker') {
      const rect = target.getBoundingClientRect();
      const clickPos = e.clientX - rect.left;
      const loc = Number(((100 / rect.width) * clickPos).toFixed(0)) / 100;
      const newStops = [...color.stops, [hexAlphaToRgba(activeColor), loc, color.stops.length]].sort(
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
        index: color.stops.length,
      });

      setActiveLoc(loc);
      setActiveIndex(color.stops.length);
    }

    return;
  };

  const setActiveRadialPosition = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const pos = target.getAttribute('data-pos');
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

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    setInit(false);

    if (e.button !== 0) return;

    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDrag = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });
  };

  const onDragEnd = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });

    removeListeners();
  };

  const pointMoveTo = (coords: TCoords) => {
    const rect = node && node.current.getBoundingClientRect();
    const width = rect.width;
    let pos = coords.x - rect.left;
    pos = Math.max(0, pos);
    pos = Math.min(pos, width);

    let location = Number(((100 / rect.width) * pos).toFixed(0)) / 100;
    setActiveLoc(location);
  };

  const removeListeners = () => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('mousemove', onDragAngle);
    window.removeEventListener('mouseup', onDragAngleEnd);
  };

  const onMoudeDownAngle = (e: any) => {
    e.preventDefault();

    setInit(false);

    if (e.button !== 0) return;

    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    if (e.target.className !== 'gradient-mode' && type === 'linear') {
      pointMoveToAngle({
        x,
        y,
        shiftKey,
        ctrlKey,
      });

      window.addEventListener('mousemove', onDragAngle);
      window.addEventListener('mouseup', onDragAngleEnd);
    }
  };

  const onDragAngle = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    pointMoveToAngle({
      x,
      y,
      shiftKey,
      ctrlKey,
    });
  };

  const onDragAngleEnd = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    pointMoveToAngle({
      x,
      y,
      shiftKey,
      ctrlKey,
    });

    removeListeners();
  };

  const pointMoveToAngle = (coords: TCoords) => {
    const rect = angleNode && angleNode.current.getBoundingClientRect();

    const boxcx = rect.left + rect.width / 2;
    const boxcy = rect.top + rect.height / 2;
    const radians = Math.atan2(coords.x - boxcx, coords.y - boxcy) - Math.PI;
    const degrees = Math.abs((radians * 180) / Math.PI);

    const div = [1, 2, 4][Number(coords.shiftKey || coords.ctrlKey)];
    const newAngle = degrees - (degrees % (45 / div));
    setColor({ ...color, gradient: `${getGradient(type, stops, newAngle)}`, modifier: newAngle });
  };

  useEffect(() => {
    const newActive = stops.find((item: [string, number, number]) => item[2] === activeIndex);
    const rgbaArr = rgbaToArray(newActive && newActive[0]);
    const hex = rgbaToHex([rgbaArr[0], rgbaArr[1], rgbaArr[2]]);

    setActiveColor({
      hex,
      alpha: Number(rgbaArr[3].toFixed(0)) * 100,
      loc: newActive[1],
      index: activeIndex,
    });

    const newStops = stops
      .map((item: [string, number, number]) => {
        if (activeIndex === item[2]) {
          return [item[0], activeLoc, item[2]];
        }
        return item;
      })
      .sort((a: [string, number], b: [string, number]) => a[1] - b[1]);

    setColor({
      ...color,
      gradient: `${getGradient(type, newStops, modifier)}`,
      stops: newStops,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, activeLoc]);

  useEffect(() => {
    if (type === 'radial') {
      const activePos = radialsPosition.find((item) => item.css === modifier);
      setColor({
        ...color,
        modifier: activePos && activePos.css,
        gradient: `${getGradient('radial', stops, activePos && activePos.css)}`,
      });

      setRadialPosition(
        RADIALS_POS.map((item) => {
          if (item.css === modifier) {
            return {
              ...item,
              active: true,
            };
          }

          return {
            ...item,
            active: false,
          };
        })
      );
    }

    return () => removeListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='gradient-interaction'>
      <div className='gradient-result' onMouseDown={(e) => onMoudeDownAngle(e)} style={{ background: gradient }}>
        <div data-mode={type} className='gradient-mode' onClick={() => onClickMode()}></div>
        <div
          className='gradient-angle'
          ref={angleNode}
          style={{ visibility: type === 'linear' ? 'visible' : 'hidden' }}
        >
          <div
            style={{ transform: `rotate(${typeof modifier === 'number' ? modifier - 90 + 'deg' : modifier})` }}
          ></div>
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
      <div className='gradient-stops' onClick={(e) => onAddColorStop(e)} ref={node}>
        <div
          className='gradient-stop-preview'
          style={{
            background: `linear-gradient(to right, ${stops
              .map((color: [string, number, number]) => `${color[0]} ${color[1] * 100}%`)
              .join(', ')})`,
          }}
        />
        <div className='gradient-stop-marker'>
          {stops.map((color: [string, number, number]) => {
            const position = color[1] * 100;
            const rgba = color[0];

            return (
              <div
                key={rgba + position + Math.random() * 100}
                className='gradient-marker'
                style={{ left: position + '%', color: rgba }}
                onMouseDown={(e) => {
                  setActiveIndex(color[2]);
                  onMouseDown(e);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientPanel;
