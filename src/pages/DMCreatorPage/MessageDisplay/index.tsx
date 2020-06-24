import React, { useState } from 'react';

import ContentEditable from 'react-contenteditable';

import { Message } from '../StepsReducer';
import './Message.css';


const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messageText, name, profilePicture,
  message, onUpdate
}) => {
  const [expanded, setExpanded] = useState(false);

  const [text, setText] = useState(messageText || message?.text);
  const [image, setImage] = useState(message?.image);
  const [waitTime, setWait] = useState(message ? message?.waitingTime / 1000 : 0);
  const [typeTime, setType] = useState(message ? message?.typingTime / 1000 : 0);

  return (
    <div className={"Message"}>
      {profilePicture && <img className="authorPic" alt="Author" src={profilePicture}/>}
      <div className="messageBody" onClick={() => {
          setExpanded(!expanded);
          if (expanded) onUpdate?.({ ...message, text, image, typingTime: typeTime, waitingTime: waitTime });
        }}
      >
        {name && <div className="authorName">{name}</div>}
        
        <ContentEditable
          className="messageText" 
          html={text!}
          onChange={e => setText(e.target.value)}
        />
      </div>

      {expanded && (
        <div className="expandedContainer">
          <div className="row">
            <div>Wait </div>
              <input type="number" min={0.1} value={waitTime?.toString()} onChange={e => setWait(parseFloat(e.target.value) || 0)} />
            <div> second{typeTime === 1 ? '' : 's'}</div>
          </div>
          <div className="row">
            <div>Type for </div>
            <input type="number" value={typeTime?.toString()} onChange={e => setType(parseFloat(e.target.value) || 0)} />
            <div> second{typeTime === 1 ? '' : 's'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface MessageDisplayProps {
  messageText?: string;
  name?: string,
  profilePicture?: string,

  message?: Message,
  onUpdate?: (message: Partial<Message>) => void;
}

export default MessageDisplay;