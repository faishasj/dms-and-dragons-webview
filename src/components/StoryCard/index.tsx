import React, { FC } from 'react';

import { Story } from '../../constants/Types';

import Link from '../Link';
import './StoryCard.css';


const StoryCard: FC<StoryCardProps> = ({ 
  story: {authorName, published, metadata: {title, description, genre, coverPhoto}}, 
  isLibrary, readCallback, editCallback, deleteCallback 
}) => {
  return (
    <div className="StoryCard">
      <div className="card"/>
      <div className="data">
        <div className="coverPhotoContainer">
          <img className="coverPhoto" alt="Cover" src={ coverPhoto }/>
        </div>
        <div className="textData"> 
          <div className="title">
            <div className="textTitle">{ title }</div>
            { isLibrary && authorName ? (
              <div className="author">by { authorName }</div>
            ) : published && (
              <div className="published">PUBLISHED</div>
            )}
          </div>
          <div className="genre">Genre: { genre }</div>
          <div className="description">{ description }</div>
          <div className="actions">
            { isLibrary && readCallback ? (
              <Link className="read" label="READ NOW" onClick={readCallback}/>
            ) : editCallback && deleteCallback && (
              <>
                <Link className="edit" label="EDIT" onClick={editCallback}/>
                <Link className="delete" label="DELETE" onClick={deleteCallback}/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface StoryCardProps {
  story: Story,
  isLibrary: boolean,
  readCallback?: () => void,
  editCallback?: () => void,
  deleteCallback?: () => void
}

export default StoryCard;