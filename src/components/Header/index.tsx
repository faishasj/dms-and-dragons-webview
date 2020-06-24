import React, { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import "./Header.css";


const Header: FC<HeaderProps> = ({ pageTitle, settingsCallback }) => {
  return (
    <div className="Header">
      <div className="headerText">
        <div className="siteName">
          <span className="siteBubble">DMs</span> and Dragons <span role="img" aria-label="Dragon">🐉</span>
        </div>
        <div className="pageTitle">| { pageTitle }</div>
      </div>
      { settingsCallback && (
        <FontAwesomeIcon className="cog" icon={ faCog } onClick={settingsCallback} />
      )}
    </div>
  );
}

export interface HeaderProps {
  pageTitle: string,
  settingsCallback?: () => void
}

export default Header;