import React, { useState, useCallback, useMemo } from 'react';

import ContentEditable from 'react-contenteditable';

import useFileUpload, { FileError } from '../../../hooks/useFileUpload';
import { Message } from '../StepsReducer';
import Link from '../../../components/Link';
import './Message.css';


const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messageText, name, profilePicture,
  message, onUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);

  const update = useCallback((key: keyof Message, value: any) => onUpdate?.({ ...message, [key]: value }), [message, onUpdate]);
  const updateTime = useCallback((key: keyof Message, value: number) => {
    if (value > 100 || value < 0 || (value.toString().length > 3)) return;
    return update(key, (value * 1000) || 0);
  }, [update]);

  const removeImage = useCallback(() => {
    update('imageFile', null);
    if (message?.imageFile) URL.revokeObjectURL(message.imageFile.preview);
  }, [message?.imageFile, update]); // eslint-disable-line react-hooks/exhaustive-deps

  const waitTime = useMemo(() => (message?.waitingTime || 0) / 1000, [message]);
  const typeTime = useMemo(() => (message?.typingTime || 0) / 1000, [message]);

  const image = message?.imageFile ? message?.imageFile.preview : message?.image;

  const { open, getInputProps } = useFileUpload(imageFile => update('imageFile', imageFile), setFileErrors);

  return (
    <div className="Message">
      {profilePicture && <img className="authorPic" alt="Author" src={profilePicture}/>}
      <div>
        <div className="messageBody" onClick={() => setExpanded(!expanded)}>
          {name && <div className="authorName">{name}</div>}
          {image ? <img className="messageImage" alt="Message Content" src={image} /> : (
            <ContentEditable
              className="messageText" 
              html={messageText || message?.text || ''}
              onChange={e => update('text', e.target.value)}
            />
          )}
        </div>

        {expanded && (
          <div className="expandedContainer">
            <Link label="Add Image" onClick={open} />
            {message?.imageFile && <Link label="Remove Image" onClick={removeImage} />}
            <input {...getInputProps()} />
            {fileErrors.map(error => <p className="errorText" key={error.code}>{error.message}</p>)}
            <div className="row">
              <div>Wait </div>
                <input
                  type="number"
                  min={0.1}
                  max={100}
                  value={waitTime.toString()}
                  onChange={e => updateTime('waitingTime', parseFloat(e.target.value))}
                />
              <div> second{typeTime === 1 ? '' : 's'}</div>
            </div>
            <div className="row">
              <div>Type for </div>
              <input
                type="number"
                min={0.1}
                max={100}
                value={typeTime.toString()}
                onChange={e => updateTime('typingTime', parseFloat(e.target.value))}
              />
              <div> second{typeTime === 1 ? '' : 's'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export interface MessageDisplayProps {
  messageText?: string;
  name?: string;
  profilePicture?: string;

  message?: Message;
  onUpdate?: (message: Partial<Message>) => void;
}

export default MessageDisplay;