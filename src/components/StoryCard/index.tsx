import React from 'react';

import Link from '../Link';
import './StoryCard.css';


const StoryCard: React.FC<StoryCardProps> 
  = ({ isLibrary, title, description, genre, coverPhoto, authorName, published, 
    readCallback, editCallback, deleteCallback }) => {

  return (
    <div className="StoryCard">
      <div className="card"/>
      <div className="data">
        <img className="coverPhoto" src={ coverPhoto }/>
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
  isLibrary: boolean,
  title: string,
  description: string,
  genre: string,
  coverPhoto: string,
  authorName?: string,
  published?: boolean,
  readCallback?: () => void,
  editCallback?: () => void,
  deleteCallback?: () => void
}

export default StoryCard;