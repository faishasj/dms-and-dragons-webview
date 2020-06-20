import React, { FC } from 'react';
import './Link.css';


const Link: FC<LinkProps> = ({ className, label, onClick }) => {
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