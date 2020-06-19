import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import Axios from 'axios';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getLibrary } from '../../api/Database';

import { MessengerContext } from '../../App';
import { ThreadContext } from '../../api/Messenger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Story } from '../../constants/Types';
import StoryCard from '../../components/StoryCard';
import Header from '../../components/Header';
import './LibraryPage.css';


const LibraryPage: React.FC<RouteComponentProps> = ({ history }) => {
  const messengerSDK: any = useContext(MessengerContext);

  const [readerID, setReaderID] = useState<string>('a');
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const setLibrary = useMemo(() => {
    const func = async () => {
      const library = await getLibrary();
      if (!searchTerm) {
        setStories(library);
      } else {
        setStories(library.filter(({metadata: {title, genre, description}}) => 
          title.toLowerCase().includes(searchTerm.toLowerCase()) 
          || genre.toLowerCase().includes(searchTerm.toLowerCase()) 
          || description.toLowerCase().includes(searchTerm.toLowerCase())));
      }
    };
    func();
    return func;
  }, [searchTerm])

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
  }, [messengerSDK, readerID])

  useEffect(() => {
    if (messengerSDK) {
      messengerSDK?.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          setReaderID(psid);
        },
        (error: any) => {}
      )
    }
    setLibrary();
  }, [messengerSDK])

  return (
    <div className="LibraryPage">
      <div className="background"/>
      <Header pageTitle="Library"/>
      <div className="container">
        <div className="searchbar">
          <input className="search" id="search" name="search" type="text" 
            placeholder="Search stories..." onChange={e => setSearchTerm(e.target.value)}/>
          <FontAwesomeIcon className="searchIcon" icon={ faSearch }/>
        </div>
        <div className="storyList">
        {readerID && stories.map(({id, authorName, metadata: { title, description, genre, coverPhoto }}, key) => (
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