import React from 'react';
import './Link.css';


const Link: React.FC<LinkProps> = ({ className, label, onClick }) => {
  return (
    <div className={"Link " + className}  onClick={ onClick }>{ label }</div>
  )
};

export interface LinkProps {
  className?: string,
  label: string,
  onClick: () => void
}

export default Link;