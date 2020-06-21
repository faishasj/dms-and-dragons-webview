import React, { FC } from 'react';

import DragonLogo from '../../assets/dragon_logo.png';
import './LandingPage.css';


const LandingPage: FC = () => {
  return (
    <div className="LandingPage">
      <img className="logo" alt="Logo" src={ DragonLogo }/>
    </div>
  )
}

export default LandingPage;