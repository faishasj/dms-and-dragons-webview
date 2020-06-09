import React from 'react';
import "./Header.css";


const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <div className="Header">
      <div className="siteName"><span className="siteBubble">DMs</span> and Dragons 🐉</div>
      <div className="pageTitle">| { pageTitle }</div>
    </div>
  );
}

export interface HeaderProps {
  pageTitle: string;
}

export default Header;