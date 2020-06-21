/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../components/Modal';
import Link from '../../../components/Link';
import { Story } from '../../../constants/Types';


const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  onDismiss,
}) => (
  <Modal>
    <div className="newStoryForm">
      <div className="title">Create a new story!</div>
      <div className="metadata">
        <div className="coverPhotoData">
          <div className="coverPhotoContainer">
            <FontAwesomeIcon icon={ faCamera }/>
          </div>
        </div>
        <div className="textData">
          <div><label htmlFor="title">TITLE</label></div>
          <input id="title" name="title" type="text" maxLength={20} 
            placeholder="Enter title..."></input>

          <div><label htmlFor="genre">GENRE</label></div>
          <select id="genre" name="genre">
            <option value="🤣 Comedy">🤣 Comedy</option>
            <option value="🎭 Drama">🎭 Drama</option>
            <option value="🤔 Educational">🤔 Educational</option>
            <option value="🏰 Fantasy">🏰 Fantasy</option>
            <option value="😱 Horror">😱 Horror</option>
            <option value="🧐 Non-fiction">🧐 Non-fiction</option>
            <option value="💕 Romance">💕 Romance</option>
            <option value="🧪 Sci-fi">🧪 Sci-fi</option>
            <option value="🤠 Western">🤠 Western</option>
          </select>
        </div>
      </div>

      <div className="descriptionContainer">
        <div><label htmlFor="description">DESCRIPTION</label></div>
        <textarea rows={4} maxLength={120} name="description" placeholder="Enter description..."/>
      </div>

      <div className="buttons">
        <Link label="CANCEL" className="cancel" onClick={onDismiss}/>
        <Link label="NEXT" onClick={() => console.log('NEXT')} />
      </div>
    </div>
  </Modal>
);

export interface CreateStoryModalProps {
  onDismiss: () => void;
  onSubmit: (data: Story) => void;
}

export default CreateStoryModal;
