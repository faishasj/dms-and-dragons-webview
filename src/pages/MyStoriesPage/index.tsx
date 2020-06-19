import React, { useState, useEffect, useCallback, useContext } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/Routes';

import { getMyStories, deleteStory } from '../../api/Database';

import { MessengerContext } from '../../App';
import { ThreadContext } from '../../api/Messenger';

import { Story } from '../../constants/Types';
import Header from '../../components/Header';
import StoryCard from '../../components/StoryCard';
import CircleButton from '../../components/CircleButton';
import DialogModal from '../../components/DialogModal';
import './MyStoriesPage.css';


const MyStoriesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const messengerSDK: any = useContext(MessengerContext);

  const [authorID, setAuthorID] = useState<string>('3933693980036784');
  const [stories, setStories] = useState<Story[]>([]);
  const [deletingStory, setDeletingStory] = useState<Story | null>(null);

  const setMyStories = useCallback(async () => {
    const myStories = await getMyStories(authorID);
    setStories(myStories);
  }, [authorID])

  const editStory = useCallback(storyID => {
    history.push(ROUTES.DM_CREATOR, { storyID });
  }, [])

  const deleteMyStory = useCallback(async storyID => {
    await deleteStory(storyID);
    setDeletingStory(null);
    setMyStories();
  }, [])

  useEffect(() => {
    if (messengerSDK) {
      messengerSDK?.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          setAuthorID(psid);
        },
        (error: any) => {}
      )
    }
  }, [messengerSDK])

  useEffect(() => {
    setMyStories();
  }, [authorID])

  return (
      <div className="MyStoriesPage">
        <div className="background"/>
        <Header pageTitle="My Stories"/>
        <div className="container">
          <div className="storyList">
            {stories.map((story, key) => (
              <StoryCard 
                key={ key }
                isLibrary={ false }
                title={ story.metadata.title } 
                description={ story.metadata.description } 
                genre={ story.metadata.genre } 
                coverPhoto={ story.metadata.coverPhoto }
                published={ story.published }
                editCallback={ () => editStory(story.id) }
                deleteCallback={ () => setDeletingStory(story) }
              />
            ))}
          </div>

          <div className="newStoryButton">
            <CircleButton icon="✍️" onClick={() => history.push(ROUTES.DM_CREATOR)}/>
          </div>
          
          {deletingStory && (
            <DialogModal 
              prompt={`Are you sure you want to delete ${deletingStory?.metadata.title}?`} 
              actionName="DELETE"
              actionCallback={() => deleteMyStory(deletingStory.id)}
              cancelName="CANCEL"
              cancelCallback={() => setDeletingStory(null)}
            />
          )}
        </div>
    </div>
  );
}

export default withRouter(MyStoriesPage);
