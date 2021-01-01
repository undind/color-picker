import './_colorpicker.scss';
import React, { Fragment, useState, FC } from 'react';

import Gradinet from './Gradient';
import Solid from './Solid';

import { PopupTabs, PopupTabsBody, PopupTabsHeader, PopupTabsHeaderLabel, PopupTabsBodyItem } from '../PopupTab';
import { getIndexActiveTag } from './helper';

type TProps = {
  value: string;
  gradient?: boolean;
  solid?: boolean;
  debounceMS?: number;
  debounce?: boolean;
  showAlpha?: boolean;
  onChange: (value: string) => void;
};

const ColorPicker: FC<TProps> = ({
  value = '#ffffff',
  gradient = false,
  solid = true,
  debounceMS = 300,
  debounce = true,
  showAlpha = true,
  onChange = () => ({}),
}) => {
  const [activeTab, setActiveTab] = useState(getIndexActiveTag(value));

  const onChangeSolid = (value: string) => {
    onChange(value);
  };

  const onChangeGradient = (value: string) => {
    onChange(value);
  };

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
            <Solid
              onChange={onChangeSolid}
              value={value}
              debounceMS={debounceMS}
              debounce={debounce}
              showAlpha={showAlpha}
            />
          </PopupTabsBodyItem>
          <PopupTabsBodyItem tabID={1}>
            <Gradinet
              onChange={onChangeGradient}
              value={value}
              debounceMS={debounceMS}
              debounce={debounce}
              showAlpha={showAlpha}
            />
          </PopupTabsBodyItem>
        </PopupTabsBody>
      </PopupTabs>
    );
  }

  return (
    <PopupTabs>
      <PopupTabsBody>
        {solid ? (
          <Solid
            onChange={onChangeSolid}
            value={value}
            debounceMS={debounceMS}
            debounce={debounce}
            showAlpha={showAlpha}
          />
        ) : (
          <Fragment />
        )}
        {gradient ? (
          <Gradinet
            onChange={onChangeGradient}
            value={value}
            debounceMS={debounceMS}
            debounce={debounce}
            showAlpha={showAlpha}
          />
        ) : (
          <Fragment />
        )}
      </PopupTabsBody>
    </PopupTabs>
  );
};

export default ColorPicker;
