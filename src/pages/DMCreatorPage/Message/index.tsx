import React, { useState } from 'react';

import { Message } from '../StepsReducer';
import './Message.css';


const MessageDisplay: React.FC<MessageDisplayProps> = ({
  isAuthor, messageText, name, profilePicture,
  message, onUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);

  const [text, setText] = useState(messageText || message?.text);
  const [image, setImage] = useState(message?.image);
  const [waitTime, setWait] = useState(message ? message?.waitingTime / 1000 : 0);
  const [typeTime, setType] = useState(message ? message?.typingTime / 1000 : 0);

  return (
    <div className={"Message" + (isAuthor ? " author": "")}>
      {profilePicture && !isAuthor && <img className="authorPic" alt="Author" src={profilePicture}/>}
      <div className="messageBody" onClick={() => {
        setExpanded(!expanded);
        if (expanded) onUpdate?.({ ...message, text, image, typingTime: typeTime, waitingTime: waitTime });
        }}>
        {name && !isAuthor && <div className="authorName">{name}</div>}
        <input className="messageText" type="textarea" disabled={isAuthor} value={text} onChange={e => setText(e.target.value)} />
      </div>
      {(expanded && !isAuthor) && (
        <div className="expandedContainer">
          <div className="row">
            <p>Wait</p>
            <input type="number" min={0.1} value={waitTime?.toString()} onChange={e => setWait(parseFloat(e.target.value) || 0)} />
            <p>second{waitTime === 1 ? '' : 's'}</p>
          </div>
          <div className="row">
            <p>Typing</p>
            <input type="number" value={typeTime?.toString()} onChange={e => setType(parseFloat(e.target.value) || 0)} />
            <p>second{typeTime === 1 ? '' : 's'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export interface MessageDisplayProps {
  isAuthor: boolean,
  messageText?: string;
  name?: string,
  profilePicture?: string,

  message?: Message,
  onUpdate?: (message: Partial<Message>) => void;
}

export default MessageDisplay;