export type TPropsChange = {
  alpha: number;
  hex: string;
};

export type TPropsChangeComp = {
  alpha: number;
  color: object;
};

export type TPropsComp = {
  rootPrefixCls?: string;
  color: any;
  alpha?: number;
  onChange: ({ alpha, color }: TPropsChangeComp) => void;
};

export type TPropsCompAlpha = {
  rootPrefixCls?: string;
  color: any;
  alpha?: any;
  onChange: (alpha: number) => void;
};

export type TPropsMain = {
  alpha: any;
  className?: string;
  hex: string;
  onChange: ({ alpha, hex }: TPropsChange) => void;
};

export type TCoords = {
  x: number;
  y: number;
};
