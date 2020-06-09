import React from 'react';

import Link from '../../../components/Link';
import './MyStoryCard.css';


const MyStoryCard: React.FC<MyStoryCardProps> = ({ title, description, genre, coverPhoto, published }) => {
  return (
    <div className="MyStoryCard">
      <div className="card"/>
      <div className="data">
        <img className="coverPhoto" src={ coverPhoto }/>
        <div className="textData"> 
          <div className="title">
            <div className="textTitle">{ title }</div>
            { published && (
              <div className="published">PUBLISHED</div>
            )}
          </div>
          <div className="genre">Genre: { genre }</div>
          <div className="description">{ description }</div>
          <div className="actions">
            <Link className="edit" label="EDIT" onClick={() => console.log("EDIT")}/>
            <Link className="delete" label="DELETE" onClick={() => console.log("DELETE")}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface MyStoryCardProps {
  title: string,
  description: string,
  genre: string,
  coverPhoto: string,
  published: boolean
}

export default MyStoryCard;