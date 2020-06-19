import React, {FC, ReactNode} from 'react';
import './Modal.css';


const Modal: FC<ModalProps> = ({ prompt, buttons }) => {
  return (
    <div className="Modal">
      <div className="modalBackground">
        <div className="modalCard">
          <div className="prompt">{ prompt }</div>
          <div className="buttons">
            { buttons }
          </div>
        </div>
      </div>
    </div>
  )
}

export interface ModalProps {
  prompt: string,
  buttons: ReactNode
}

export default Modal;