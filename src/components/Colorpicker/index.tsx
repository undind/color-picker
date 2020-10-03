import React, { Fragment, useState, FC } from 'react';
// import Gradinet from './Gradient';
import Solid from './Solid';
import { PopupTabs, PopupTabsBody, PopupTabsHeader, PopupTabsHeaderLabel, PopupTabsBodyItem } from '../PopupTab';
import { getIndexActiveTag } from './helper';

type TProps = {
  value: any;
  gradient?: boolean;
  solid?: boolean;
  onChange: (value: string) => void;
};

const ColorPicker: FC<TProps> = ({ value = '#ffffff', gradient, solid, onChange = () => ({}) }) => {
  const [activeTab, setActiveTab] = useState(getIndexActiveTag(value));

  const onChangeSolid = (value: string) => {
    onChange(value);
  };

  // const onChangeGradient = (value: string) => {
  //   onChange(value);
  // };

  if (solid && gradient) {
    return (
      <PopupTabs activeTab={activeTab}>
        <PopupTabsHeader>
          <PopupTabsHeaderLabel tabID={0} onClick={() => setActiveTab(0)}>
            Solid
          </PopupTabsHeaderLabel>
          <PopupTabsHeaderLabel tabID={1} onClick={() => setActiveTab(1)}>
            Gradient
          </PopupTabsHeaderLabel>
        </PopupTabsHeader>
        <PopupTabsBody>
          <PopupTabsBodyItem tabID={0}>
            <Solid onChange={onChangeSolid} value={value} />
          </PopupTabsBodyItem>
          <PopupTabsBodyItem tabID={1}>
            {/* <Gradinet onChange={onChangeGradient} value={value} /> */}
          </PopupTabsBodyItem>
        </PopupTabsBody>
      </PopupTabs>
    );
  }

  return (
    <PopupTabs>
      <PopupTabsBody>
        {solid ? <Solid onChange={onChangeSolid} value={value} /> : <Fragment />}
        {gradient ? (
          <div></div>
        ) : (
          // <Gradinet onChange={onChangeGradient} value={value} />
          <Fragment />
        )}
      </PopupTabsBody>
    </PopupTabs>
  );
};

ColorPicker.defaultProps = {
  gradient: false,
  solid: true,
};

export default ColorPicker;
