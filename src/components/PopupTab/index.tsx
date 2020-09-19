import React, { FC } from 'react';
import './_popup_tabs.scss';
import classNames from 'classnames';

interface Popups {
  children?: any;
  activeTab?: any;
  tabID?: any;
  onClick?: any;
}

export const PopupTabs: FC<Popups> = ({ children, activeTab }: Popups) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab,
    });
  });

  return <div className='sommerce-editor__popup_tabs'>{childrenContact}</div>;
};

export const PopupTabsHeaderLabel: FC<Popups> = ({ children, activeTab, tabID, onClick }: Popups) => {
  return (
    <div
      className={classNames('sommerce-editor__popup_tabs-header-label', {
        'sommerce-editor__popup_tabs-header-label-active': activeTab === tabID,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const PopupTabsHeader: FC<Popups> = ({ children, activeTab }: Popups) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab,
    });
  });
  return <div className='sommerce-editor__popup_tabs-header'>{childrenContact}</div>;
};

export const PopupTabsBody: FC<Popups> = ({ children, activeTab }) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab,
    });
  });

  return <div className='sommerce-editor__popup_tabs-body'>{childrenContact}</div>;
};

export const PopupTabsBodyItem: FC<Popups> = ({ children, activeTab, tabID }: Popups) => {
  if (activeTab === tabID) {
    return <div className='sommerce-editor__popup_tabs-body-item'>{children}</div>;
  }

  return null;
};
