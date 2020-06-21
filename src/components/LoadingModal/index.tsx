import React, { FC } from 'react';
import Loader from 'react-spinners/BeatLoader';
import { LoaderSizeMarginProps } from 'react-spinners/interfaces';

import Modal from '../Modal';


const LoadingModal: FC<LoadingModalProps> = ({ progress, ...props }) => (
  <div>
    <Modal>
      <Loader loading color="#57FFD7" {...props} />
      {(progress !== undefined && progress !== null) && <p>{`${progress.toFixed(2)}%`}</p>}
    </Modal>
  </div>
);

export interface LoadingModalProps extends LoaderSizeMarginProps {
  progress?: number;
}

export default LoadingModal;
