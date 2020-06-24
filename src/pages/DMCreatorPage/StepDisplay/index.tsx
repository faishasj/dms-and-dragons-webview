import React, { useCallback } from 'react';

import MessageDisplay from '../MessageDisplay';
import ReplyDisplay from '../ReplyDisplay';
import { Step, Message } from '../StepsReducer';
import './StepDisplay.css';


const StepDisplay: React.FC<StepDisplayProps> = ({ step, onNewMessage, onUpdateMessage }) => {
  const option = step.options[0]; // TODO: Branching
  const updateMessage = useCallback(data => onUpdateMessage(step, data), [step, onUpdateMessage]);
  return (
    <div className="stepDisplay">
      {step.messages.map((message, i) => (
        <div key={message.id}>
          <MessageDisplay message={message} onUpdate={updateMessage} />
        </div>
      ))}
      {option && <ReplyDisplay option={option}/>}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;
  onNewMessage: (step: Step, message: Partial<Message>) => void;
  onUpdateMessage: (step: Step, message: Partial<Message>) => void;
}
export default StepDisplay;
