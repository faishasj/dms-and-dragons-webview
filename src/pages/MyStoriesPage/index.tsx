import React, { useState, useEffect, useCallback } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getMyStories } from '../../api/Database';

import { Story } from '../../constants/Types';
import Header from '../../components/Header';
import MyStoryCard from './MyStoryCard';
import CircleButton from '../../components/CircleButton';
import './MyStoriesPage.css';


const MyStoriesPage: React.FC<MyStoriesPageProps> = ({ history, authorID }) => {
  const [stories, setStories] = useState<Story[]>([]);

  const setMyStories = useCallback(async () => {
    const myStories = await getMyStories(authorID);
    setStories(myStories);
  }, [authorID])

  useEffect(() => {
    setMyStories();
  }, [authorID])

  return (
      <div className="MyStoriesPage">
        <div className="background"/>
        <Header pageTitle="My Stories"/>
        <div className="container">
          <div className="storyList">
            {stories.map(({published, metadata: { title, description, genre, coverPhoto }}, key) => (
              <MyStoryCard 
                key={ key }
                title={ title } 
                description={ description } 
                genre={ genre } 
                coverPhoto={ coverPhoto }
                published={ published }
              />
            ))}
          </div>
          <div className="newStoryButton">
            <CircleButton icon="✍️" onClick={() => history.push(ROUTES.DM_CREATOR)}/>
          </div>
        </div>
    </div>
  );
}

export interface MyStoriesPageProps extends RouteComponentProps {
  authorID: string
}

export default withRouter(MyStoriesPage);