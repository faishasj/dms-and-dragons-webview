import React, { FC, useState, useEffect, useCallback } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import * as ROUTES from '../../constants/Routes';

import { getMyStories, deleteStory } from '../../lib/Database';
import { useFbUser } from '../../hooks/useFbUser';

import { Story, CreateStoryScheme } from '../../constants/Types';
import Header from '../../components/Header';
import StoryCard from '../../components/StoryCard';
import CircleButton from '../../components/CircleButton';
import DialogModal from '../../components/DialogModal';
import CreateStoryModal from './CreateStoryModal';
import './MyStoriesPage.css';


const MyStoriesPage: FC<RouteComponentProps> = ({ history }) => {

  const [authorID, setAuthorID] = useState<string>('');
  const [stories, setStories] = useState<Story[]>([]);
  const [deletingStory, setDeletingStory] = useState<Story | null>(null);
  const [creatingStory, setCreatingStory] = useState<boolean>(false);

  const setMyStories = useCallback(async () => {
    const myStories = await getMyStories(authorID);
    setStories(myStories);
  }, [authorID])

  const editStory = useCallback(storyID => {
    history.push(ROUTES.DM_CREATOR, { storyID });
  }, [history])

  const deleteMyStory = useCallback(async storyID => {
    await deleteStory(storyID);
    setDeletingStory(null);
    setMyStories();
  }, [setMyStories])

  const createStory = useCallback((data: CreateStoryScheme) => {
    console.log('CREATE: ', data);
  }, [])

  useEffect(() => {
    setMyStories();
  }, [setMyStories])

  useFbUser(setAuthorID)

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
            <CircleButton icon="✍️" onClick={() => setCreatingStory(true)}/>
          </div>
          
          {deletingStory && (
            <DialogModal 
              prompt={`Are you sure you want to delete ${deletingStory.metadata.title}?`} 
              actionName="DELETE"
              actionCallback={() => deleteMyStory(deletingStory.id)}
              cancelName="CANCEL"
              cancelCallback={() => setDeletingStory(null)}
            />
          )}

          {creatingStory && <CreateStoryModal onSubmit={createStory} onDismiss={() => setCreatingStory(false)} />}
        </div>
    </div>
  );
}

export default withRouter(MyStoriesPage);
