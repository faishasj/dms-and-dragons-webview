import React, { useState, useCallback } from 'react';

import MessageDisplay from '../MessageDisplay';
import ReplyDisplay from '../ReplyDisplay';
import { Step, Message, Option } from '../StepsReducer';
import './StepDisplay.css';
import { Persona } from '../../../constants/Types';


const StepDisplay: React.FC<StepDisplayProps> = ({ 
  step, personas,
  onNewMessage, onUpdateMessage, onAddOption, onUpdateOption, onDeleteOption, onAddPersona,
}) => {

  const [option, setOption] = useState<Option | null>(null); // TODO: Branching

  const updateMessage = useCallback(data => onUpdateMessage(step, data), [step, onUpdateMessage]);

  const addOption = useCallback(() => onAddOption(step), [step, onAddOption]);
  const updateOption = useCallback(data => onUpdateOption(step, data), [step, onUpdateOption]);
  const deleteOption = useCallback(id => onDeleteOption(step, id), [step, onDeleteOption]);

  return (
    <div className="stepDisplay">
      {step.messages.map(message => {
        const persona = personas.find(p => p.id === message.personaId);
        return (
          <div key={message.id}>
            <MessageDisplay
              name={persona?.name}
              profilePicture={persona?.profilePic}
              message={message}
              onUpdate={updateMessage}
              onAddPersona={() => onAddPersona(message)}
            />
          </div>
        );
      })}

      {step.options.length > 0 && (
        <ReplyDisplay 
          options={step.options} 
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          onSelectOption={opt => setOption(opt)}
        />
      )}
    </div>
  );
};

export interface StepDisplayProps {
  step: Step;
  personas: Persona[];

  onNewMessage: (step: Step, message: Partial<Message>) => void;
  onUpdateMessage: (step: Step, message: Partial<Message>) => void;

  onAddOption: (step: Step) => void;
  onUpdateOption: (step: Step, option: Partial<Option>) => void;
  onDeleteOption: (step: Step, optionId: Option['id']) => void;

  onAddPersona: (message: Message) => void;
}
export default StepDisplay;
