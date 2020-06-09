import React, { useState, useEffect, useCallback } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getMyStories } from '../../api/Database';
import { getMessengerSDK } from '../../api/Messenger';

import { Story } from '../../constants/Types';
import Header from '../../components/Header';
import MyStoryCard from './MyStoryCard';
import CircleButton from '../../components/CircleButton';
import './MyStoriesPage.css';


const MyStoriesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [authorID, setAuthorID] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);

  const setMyStories = useCallback(async () => {
    try {
      const messengerSDK = await getMessengerSDK();
      messengerSDK.getUserID(
        async (userID: string) => {
          setAuthorID(userID);
          console.log(authorID);
          const myStories = await getMyStories(authorID);
          setStories(myStories);
        },
        () => { history.push(ROUTES.LANDING); console.log("getUserID failure"); }
      )
    } catch (e) {
      console.log("getMessengerSDK ERROR");
      history.push(ROUTES.LANDING);
    }
  }, [])

  useEffect(() => {
    setMyStories();
  }, [])

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

export default withRouter(MyStoriesPage);