import React from 'react';

import Message from '../Message';
import { Step } from '../StepsReducer';
import './StepDisplay.css';


const StepDisplay: React.FC<StepDisplayProps> = ({ step, onNewMessage }) => {
  const option = step.options[0]; // TODO: Branching
  return (
    <div className="stepDisplay">
      {step.messages.map((message, i) => {
        const { text } = message;
        return (
          <div key={`${JSON.stringify(message)} - ${i}`}>
            <Message isAuthor={false} message={text || ''} />
          </div>
        );
      })}
      {option && <Message isAuthor message={option.requiredText} />}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;
  onNewMessage: (step: Step, message: Partial<Step['messages'][0]>) => void;
}
export default StepDisplay;
