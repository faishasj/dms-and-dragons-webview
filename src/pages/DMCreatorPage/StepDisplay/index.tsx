import React, { useState, useCallback } from 'react';

import MessageDisplay from '../MessageDisplay';
import ReplyDisplay from '../ReplyDisplay';
import { Step, Message, Option } from '../StepsReducer';
import './StepDisplay.css';


const StepDisplay: React.FC<StepDisplayProps> = ({ 
  step, onNewMessage, onUpdateMessage, onAddOption, onUpdateOption, onDeleteOption
}) => {

  const [option, setOption] = useState(null);// TODO: Branching

  const updateMessage = useCallback(data => onUpdateMessage(step, data), [step, onUpdateMessage]);

  const addOption = useCallback(() => onAddOption(step), [step, onAddOption]);
  const updateOption = useCallback(data => onUpdateOption(step, data), [step, onUpdateOption]);
  const deleteOption = useCallback(id => onDeleteOption(step, id), [step, onDeleteOption]);

  return (
    <div className="stepDisplay">
      {step.messages.map(message => (
        <div key={message.id}>
          <MessageDisplay message={message} onUpdate={updateMessage} />
        </div>
      ))}

      {step.options.length > 0 && (
        <ReplyDisplay 
          options={step.options} 
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          onSelectOption={opt => console.log(opt)}
        />
      )}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;

  onNewMessage: (step: Step, message: Partial<Message>) => void;
  onUpdateMessage: (step: Step, message: Partial<Message>) => void;

  onAddOption: (step: Step) => void;
  onUpdateOption: (step: Step, option: Partial<Option>) => void;
  onDeleteOption: (step: Step, optionId: Option['id']) => void;
}
export default StepDisplay;
