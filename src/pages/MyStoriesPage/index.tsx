import React, { useState, useEffect, useCallback, useContext } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getMyStories } from '../../api/Database';

import { MessengerContext } from '../../App';
import { ThreadContext } from '../../api/Messenger';

import { Story } from '../../constants/Types';
import Header from '../../components/Header';
import StoryCard from '../../components/StoryCard';
import CircleButton from '../../components/CircleButton';
import './MyStoriesPage.css';


const MyStoriesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const messengerSDK: any = useContext(MessengerContext);

  const [authorID, setAuthorID] = useState<string>('');
  const [stories, setStories] = useState<Story[]>([]);

  const setMyStories = useCallback(async () => {
    const myStories = await getMyStories('3933693980036784');
    setStories(myStories);
  }, [authorID])

  useEffect(() => {
    if (messengerSDK) {
      messengerSDK?.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          setAuthorID(psid);
        },
        (error: any) => {}
      )
    } else {
      history.replace(ROUTES.LANDING);
    }
  }, [])

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
              <StoryCard 
                key={ key }
                isLibrary={ false }
                title={ title } 
                description={ description } 
                genre={ genre } 
                coverPhoto={ coverPhoto }
                published={ published }
                editCallback={ () => alert("HI") }
                deleteCallback={ () => alert("TEST") }
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
