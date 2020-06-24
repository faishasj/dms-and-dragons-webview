import React, { useCallback } from 'react';

import MessageDisplay from '../MessageDisplay';
import ReplyDisplay from '../ReplyDisplay';
import { Step, Message, Option } from '../StepsReducer';
import './StepDisplay.css';
import { Persona } from '../../../constants/Types';


const StepDisplay: React.FC<StepDisplayProps> = ({ 
  step, personas, isBranch,
  onNewMessage, onUpdateMessage, onAddOption, onUpdateOption, onDeleteOption, onEditPersona, onSetBranch
}) => {

  const updateMessage = useCallback(data => onUpdateMessage(step, data), [step, onUpdateMessage]);

  const addOption = useCallback(() => onAddOption(step), [step, onAddOption]);
  const updateOption = useCallback(data => onUpdateOption(step, data), [step, onUpdateOption]);
  const deleteOption = useCallback(id => onDeleteOption(step, id), [step, onDeleteOption]);

  const setBranch = useCallback(option => onSetBranch(step, option), [step, onSetBranch]);

  return (
    <div className={"stepDisplay" + (isBranch ? " branch" : "")}>
      {step.messages.map(message => {
        const persona = personas.find(p => p.id === message.personaId);
        return (
          <div key={message.id}>
            <MessageDisplay
              name={persona?.name}
              profilePicture={persona?.profilePic}
              message={message}
              onUpdate={updateMessage}
              onEditPersona={() => onEditPersona(message)}
            />
          </div>
        );
      })}

      {step.options.length > 0 && !isBranch && (
        <ReplyDisplay 
          options={step.options} 
          
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          onSelectOption={setBranch}
        />
      )}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;
  personas: Persona[];
  isBranch: boolean;

  onNewMessage: (step: Step, message: Partial<Message>) => void;
  onUpdateMessage: (step: Step, message: Partial<Message>) => void;

  onAddOption: (step: Step) => void;
  onUpdateOption: (step: Step, option: Partial<Option>) => void;
  onDeleteOption: (step: Step, optionId: Option['id']) => void;

  onEditPersona: (message: Message) => void;
  
  onSetBranch: (step: Step, option: Partial<Option>) => void;
}
export default StepDisplay;
