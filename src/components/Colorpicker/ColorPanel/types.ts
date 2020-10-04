export type TPropsChange = {
  alpha: number;
  color: string;
};

export type TPropsComp = {
  rootPrefixCls?: string;
  color: any;
  alpha?: number;
  onChange: ({ alpha, color }: TPropsChange) => void;
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
  onChange: ({ alpha, color }: TPropsChange) => void;
};

export type TCoords = {
  x: number;
  y: number;
};
