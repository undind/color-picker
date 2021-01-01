import { Dispatch, SetStateAction } from 'react';

import { ITinyColor } from '../../../utils/color';

export type TPropsChange = {
  alpha: number;
  hex: string;
};

export type TPropsComp = {
  rootPrefixCls?: string;
  color: ITinyColor;
  alpha?: number;
  onChange: (color: ITinyColor) => void;
  setChange: Dispatch<SetStateAction<boolean>>;
};

export type TPropsCompAlpha = {
  rootPrefixCls?: string;
  color: ITinyColor;
  alpha?: number;
  showAlpha?: boolean;
  onChange: (alpha: number) => void;
  setChange: Dispatch<SetStateAction<boolean>>;
};

export type TPropsMain = {
  alpha: number;
  className?: string;
  hex: string;
  showAlpha?: boolean;
  onChange: ({ alpha, hex }: TPropsChange) => void;
};

export type TCoords = {
  x: number;
  y: number;
};
