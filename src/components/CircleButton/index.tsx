import React, { FC } from 'react';
import './CircleButton.css';


const CircleButton: FC<CircleButtonProps> = ({ icon, onClick }) => {
  return (
    <div className="CircleButton" onClick={ onClick }>{ icon }</div>
  )
}

export interface CircleButtonProps {
  icon: string,
  onClick: () => void
}

export default CircleButton;