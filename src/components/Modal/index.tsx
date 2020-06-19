import React, {FC, ReactNode} from 'react';
import './Modal.css';


const Modal: FC<ModalProps> = ({ children }) => {
  return (
    <div className="Modal">
      <div className="modalBackground">
        <div className="modalCard">
          { children }
        </div>
      </div>
    </div>
  )
}

export interface ModalProps {
  children: ReactNode
}

export default Modal;