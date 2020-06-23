import React, { useCallback } from 'react';

import MessageDisplay from '../Message';
import { Step, Message } from '../StepsReducer';
import './StepDisplay.css';


const StepDisplay: React.FC<StepDisplayProps> = ({ step, onNewMessage, onUpdateMessage }) => {
  const option = step.options[0]; // TODO: Branching
  const updateMessage = useCallback(data => onUpdateMessage(step, data), [step, onUpdateMessage]);
  return (
    <div className="stepDisplay">
      {step.messages.map((message, i) => {
        return (
          <div key={`${JSON.stringify(message)} - ${i}`}>
            <MessageDisplay isAuthor={false} message={message} onUpdate={updateMessage} />
          </div>
        );
      })}
      {option && <MessageDisplay isAuthor messageText={option.requiredText} />}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;
  onNewMessage: (step: Step, message: Partial<Message>) => void;
  onUpdateMessage: (step: Step, message: Partial<Message>) => void;
}
export default StepDisplay;
