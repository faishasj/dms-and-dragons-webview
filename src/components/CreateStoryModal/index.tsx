/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import Modal from '../Modal';
import Link from '../Link';
import useFileUpload, { PreviewFile, FileError } from '../../hooks/useFileUpload';
import { CreateStoryScheme, Story } from '../../constants/Types';
import './CreateStoryModal.css';
import PersonaDisplay from '../PersonaDisplay';


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
  onSubmit,
  onSubmitPersona,
  onEdit,
  story,
}) => {
  const [title, setTitle] = useState(story?.metadata.title || '');
  const [genre, setGenre] = useState(story?.metadata.genre || GENRES[0]);
  const [description, setDescription] = useState(story?.metadata.description || '');
  const [imageFile, setImageFile] = useState<PreviewFile | null>(null);
  const [existingImage] = useState(story?.metadata.coverPhoto);

  const [fileErrors, setFileErrors] = useState<FileError[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = useCallback(() => {
    if (!!title && !!genre && !!description && !!imageFile) {
      setErrors([]);
      if (story && onEdit) onEdit({
        ...story,
        metadata: { ...story.metadata, title, description, genre },
      }, imageFile);
      else onSubmit?.({ title, description, genre, image: imageFile });
    } else {
      setErrors([
        !title && 'Must include title',
        !description && 'Must include description',
        !genre && 'Must include genre',
        !imageFile && 'Must include cover image',
      ].filter(a => a) as string[]);
    }
  }, [title, genre, description, imageFile, story, onSubmit, onEdit]);

  const { getRootProps, getInputProps } = useFileUpload(setImageFile, setFileErrors);

  return (
    <Modal>
      <div className="newStoryForm">
        <div className="title">{story ? `Edit ${story.metadata.title}` : `Create a new story!`}</div>
        {errors.map(error => <p className="errorText" key={error}>{error}</p>)}
        <div className="metadata">
          <div className="coverPhotoData">
            <div {...getRootProps()} className="coverPhotoContainer">
              <input {...getInputProps()} />
              {(imageFile || existingImage)
                ? <img className="coverPhoto" alt="Story Cover" src={imageFile ? imageFile.preview : existingImage} />
                : <FontAwesomeIcon icon={ faCamera }/>}
              {fileErrors.map(({ code, message }) => <p className="errorText" key={code}>{message}</p>)}
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
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <div><label htmlFor="genre">GENRE</label></div>
            <select id="genre" name="genre" value={genre} onChange={e => setGenre(e.target.value)}>
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
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {onSubmitPersona && (
          <div>
            <div><label htmlFor="personas">PERSONAS</label></div>
            {story?.personas.map(persona => <PersonaDisplay key={persona.id} persona={persona} />)}
            <div><label htmlFor="personas">NEW PERSONA</label></div>
            <PersonaDisplay onSubmitPersona={onSubmitPersona} />
          </div>
        )}

        <div className="buttons">
          <Link label="CANCEL" className="cancel" onClick={onDismiss}/>
          <Link label={story ? 'SAVE' : 'NEXT'} onClick={submit} />
        </div>
      </div>
    </Modal>
  );
};

export interface CreateStoryModalProps {
  onDismiss: () => void;
  onSubmit?: (data: CreateStoryScheme) => void;
  onSubmitPersona?: (name: string, imageFile: PreviewFile) => void;
  onEdit?: (story: Story, newImage?: PreviewFile) => void;
  story?: Story;
}

export default CreateStoryModal;
