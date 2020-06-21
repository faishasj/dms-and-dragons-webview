import React from 'react';
import './Message.css';


const Message: React.FC<MessengerProps> = ({ isAuthor, message, name, profilePicture }) => {
  return (
    <div className={"Message" + (isAuthor ? " author": "")}>
      { profilePicture && !isAuthor && (
        <img className="authorPic" alt="Author" src={ profilePicture }/>
      )}
      <div className="messageBody">
        { name && !isAuthor && (
          <div className="authorName">{ name }</div>
        )}
        <div className="messageText">{ message }</div>
      </div>
    </div>
  )
}

export interface MessengerProps {
  isAuthor: boolean,
  message: string,
  name?: string,
  profilePicture?: string,
}

export default Message;