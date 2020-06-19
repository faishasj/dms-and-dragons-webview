import React, { FC } from 'react';

import Modal from '../Modal';
import Link from '../Link';
import './DialogModal.css';


const DialogModal: FC<DialogModalProps> 
  = ({ prompt, actionName, cancelName, actionCallback, cancelCallback}) => {
  return (
    <div className="DialogModal">
      <Modal>
        <div className="prompt">{ prompt }</div>
        <div className="buttons">
          <Link label={ cancelName } onClick={ cancelCallback }/>
          <Link label={ actionName } className="action" onClick={ actionCallback }/>
        </div>
      </Modal>
    </div>
  )
}

export interface DialogModalProps {
  prompt: string,
  actionName: string,
  cancelName: string,
  actionCallback: () => void,
  cancelCallback: () => void
}

export default DialogModal;