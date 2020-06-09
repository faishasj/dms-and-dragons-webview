import React from 'react';

import DragonLogo from '../../assets/dragon_logo.png';
import './LandingPage.css';


const LandingPage: React.FC = () => {
  return (
    <div className="LandingPage">
      <img className="logo" src={ DragonLogo }/>
    </div>
  )
}

export default LandingPage;