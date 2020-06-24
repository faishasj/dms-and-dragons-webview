import React, { FC, useState, useEffect } from 'react';

import ContentEditable from 'react-contenteditable';

import { Option } from '../StepsReducer';
import './ReplyDisplay.css'


const ReplyDisplay: FC<ReplyDisplay> = ({ 
  options, onAddOption, onUpdateOption, onDeleteOption, onSelectOption 
}) => {

  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  useEffect(() => {
    const updatedOption = options.find(option => option.id === selectedOption.id);
    setSelectedOption(updatedOption || options[0]);
  }, [options])

  useEffect(() => {
    setSelectedOption(selectedOption);
  }, [selectedOption])

  useEffect(() => onSelectOption(selectedOption), [selectedOption]);
  
  return (
    <div className="Reply">
      <div className="messageText" onClick={() => setExpanded(!expanded)}>
        { selectedOption.requiredText ? selectedOption.requiredText : ("Any reply") }
      </div>

      <div className="options">
      { expanded && (
        <>
          {options.length > 1 && options.map((option, i) => (
            <div key={option.id} className={"option " + (option.id === selectedOption.id && "selected")}>
              <ContentEditable 
                key={ option.id }
                className="textbox"
                html={option.requiredText}
                disabled={option.id !== selectedOption.id}
                onClick={() => setSelectedOption(option)}
                onChange={e => onUpdateOption({id: option.id, requiredText: e.target.value})}
              />

              {options.length > 1 && (
                <div className="delete" onClick={() => {
                  onDeleteOption(option.id); 
                  setSelectedOption(options[i - 1] || options[i + 1]);
                }}>x</div>
              )}
            </div>
          ))}
          <div 
            className="option addOption" 
            onClick={onAddOption}>+</div>
        </>
      )}
      </div>
    </div>
  )
}

export interface ReplyDisplay {
  options: Option[],

  onAddOption: () => void,
  onUpdateOption: (option: Partial<Option>) => void,
  onDeleteOption: (optionId: Option['id']) => void,
  onSelectOption: (option: Option) => void,
}

export default ReplyDisplay;