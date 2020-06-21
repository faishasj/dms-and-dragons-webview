import React, { FC } from 'react';
import "./Header.css";


const Header: FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <div className="Header">
      <div className="siteName">
        <span className="siteBubble">DMs</span> and Dragons <span role="img" aria-label="Dragon">🐉</span>
      </div>
      <div className="pageTitle">| { pageTitle }</div>
    </div>
  );
}

export interface HeaderProps {
  pageTitle: string;
}

export default Header;