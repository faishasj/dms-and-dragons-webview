import React, { useState, useCallback, useEffect, useContext } from 'react';
import Axios from 'axios';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getLibrary } from '../../api/Database';

import { MessengerContext } from '../../App';
import { ThreadContext } from '../../api/Messenger';

import { Story } from '../../constants/Types';
import StoryCard from '../../components/StoryCard';
import Header from '../../components/Header';
import './LibraryPage.css';


const LibraryPage: React.FC<RouteComponentProps> = ({ history }) => {
  const messengerSDK: any = useContext(MessengerContext);

  const [readerID, setReaderID] = useState<string>('');
  const [stories, setStories] = useState<Story[]>([]);

  const setLibrary = useCallback(async () => {
    const library = await getLibrary();
    setStories(library);
  }, [])

  const readStory = useCallback(storyId => {

    if (messengerSDK) {
      messengerSDK.requestCloseBrowser(
        () => {
          Axios.post(process.env.REACT_APP_WEBHOOK + '/webview/readStory',
            { storyId, userId: readerID })
        }, 
        () => console.log("ERROR")
      );
    }
  }, [])

  useEffect(() => {
    if (messengerSDK) {
      messengerSDK?.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          setReaderID(psid);
        },
        (error: any) => {}
      )
    } else {
      history.replace(ROUTES.LANDING);
    }
    setLibrary();
  }, [])

  return (
    <div className="LibraryPage">
      <div className="background"/>
      <Header pageTitle="Library"/>
      <div className="container">
        <div className="storyList">
        {stories.map(({id, authorName, metadata: { title, description, genre, coverPhoto }}, key) => (
            <StoryCard 
              key={ key }
              isLibrary={ true }
              title={ title } 
              authorName={ authorName }
              description={ description } 
              genre={ genre } 
              coverPhoto={ coverPhoto }
              readCallback={ () => readStory(id) }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default withRouter(LibraryPage);