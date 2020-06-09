import React from 'react';
import './CircleButton.css';


const CircleButton: React.FC<CircleButtonProps> = ({ icon, onClick }) => {
  return (
    <div className="CircleButton" onClick={ onClick }>{ icon }</div>
  )
}

export interface CircleButtonProps {
  icon: string,
  onClick: () => void
}

export default CircleButton;