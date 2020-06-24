import React, { FC } from 'react';

import { Option } from '../StepsReducer';
import './ReplyDisplay.css'


const ReplyDisplay: FC<ReplyDisplay> = ({ option }) => {
  return (
    <div className="Reply">
      <div className="messageText">
        {option.requiredText}
      </div>
    </div>
  )
}

export interface ReplyDisplay {
  option: Option,
}

export default ReplyDisplay;