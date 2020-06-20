import React, { FC } from 'react';

import Header from '../../components/Header';
import Message from './Message';
import './DMCreatorPage.css';


const DMCreatorPage: React.FC<DMCreatorPageProps> = ({ storyID }) => {
  return (
    <div className="DMCreatorPage">
      <Header pageTitle="DM Creator"/>
      <div className="container">
        <div className="messengerView">
          <Message isAuthor={false} profilePicture={"https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2-768x768.jpeg"} message={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}/>
          <Message isAuthor={false} name="Greg" profilePicture={"https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2-768x768.jpeg"} message={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}/>
          <Message isAuthor={false} name="Larry" profilePicture={"https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2-768x768.jpeg"} message={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}/>
          <Message isAuthor={true} profilePicture={"https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2-768x768.jpeg"} message={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}/>
          <Message isAuthor={false} profilePicture={"https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2-768x768.jpeg"} message={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}/>
        </div>
        <div className="toolbar"></div>
      </div>
    </div>
  )
}

export interface DMCreatorPageProps {
  storyID?: string
}

export default DMCreatorPage;