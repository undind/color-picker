import { ReactText } from 'react';

export interface IPropsComp {
  value: string;
  onChange: (value: string) => void;
  debounceMS?: number;
  debounce?: boolean;
  showAlpha?: boolean;
}

export interface IPropsMain extends IPropsComp {
  gradient?: boolean;
  solid?: boolean;
}

export type TPropsChange = {
  alpha: number;
  hex: string;
};

export interface IActiveColor {
  hex: string;
  alpha: number;
  loc: ReactText;
  index: ReactText;
}
