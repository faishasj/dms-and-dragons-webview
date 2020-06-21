/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../components/Modal';
import Link from '../../../components/Link';
import { Story } from '../../../constants/Types';


const GENRES = [
  '🤣 Comedy',
  '🎭 Drama',
  '🤔 Educational',
  '🏰 Fantasy',
  '😱 Horror',
  '🧐 Non-fiction',
  '💕 Romance',
  '🧪 Sci-fi',
  '🤠 Western',
];


const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  onDismiss,
}) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [description, setDescription] = useState('');

  const submit = useCallback(() => {
    console.log(title, genre, description);
  }, [title, genre, description]);

  return (
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
            <input
              id="title"
              name="title"
              type="text"
              maxLength={20} 
              placeholder="Enter title..."
              onChange={e => setTitle(e.target.value)}
            ></input>

            <div><label htmlFor="genre">GENRE</label></div>
            <select id="genre" name="genre" onChange={e => setGenre(e.target.value)}>
              {GENRES.map(genreOption => <option key={genreOption} value={genreOption}>{genreOption}</option>)}
            </select>
          </div>
        </div>

        <div className="descriptionContainer">
          <div><label htmlFor="description">DESCRIPTION</label></div>
          <textarea
            rows={4}
            maxLength={120}
            name="description"
            placeholder="Enter description..."
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="buttons">
          <Link label="CANCEL" className="cancel" onClick={onDismiss}/>
          <Link label="NEXT" onClick={submit} />
        </div>
      </div>
    </Modal>
  );
};

export interface CreateStoryModalProps {
  onDismiss: () => void;
  onSubmit: (data: Story) => void;
}

export default CreateStoryModal;
