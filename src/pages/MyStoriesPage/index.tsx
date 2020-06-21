import React, { FC, useState, useEffect, useCallback } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import * as ROUTES from '../../constants/Routes';

import { getMyStories, deleteStory } from '../../lib/Database';
import { useFbUser } from '../../hooks/useFbUser';

import { Story } from '../../constants/Types';
import Header from '../../components/Header';
import StoryCard from '../../components/StoryCard';
import CircleButton from '../../components/CircleButton';
import Modal from '../../components/Modal';
import DialogModal from '../../components/DialogModal';
import Link from '../../components/Link';
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

  const createStory = useCallback(() => {

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
              prompt={`Are you sure you want to delete ${deletingStory?.metadata.title}?`} 
              actionName="DELETE"
              actionCallback={() => deleteMyStory(deletingStory.id)}
              cancelName="CANCEL"
              cancelCallback={() => setDeletingStory(null)}
            />
          )}

          {creatingStory && (
            <Modal>
              <div className="newStoryForm">
                <div className="title">Create a new story!</div>
                <div className="metadata">
                  <div className="coverPhotoData">
                    <div className="coverPhotoContainer">
                      <FontAwesomeIcon icon={ faCamera }/>
                    </div>
                  </div>
                  <div className="textData">
                    <div><label htmlFor="title">TITLE</label></div>
                    <input id="title" name="title" type="text" maxLength={20} 
                      placeholder="Enter title..."></input>

                    <div><label htmlFor="genre">GENRE</label></div>
                    <select id="genre" name="genre">
                      <option value="🤣 Comedy">🤣 Comedy</option>
                      <option value="🎭 Drama">🎭 Drama</option>
                      <option value="🤔 Educational">🤔 Educational</option>
                      <option value="🏰 Fantasy">🏰 Fantasy</option>
                      <option value="😱 Horror">😱 Horror</option>
                      <option value="🧐 Non-fiction">🧐 Non-fiction</option>
                      <option value="💕 Romance">💕 Romance</option>
                      <option value="🧪 Sci-fi">🧪 Sci-fi</option>
                      <option value="🤠 Western">🤠 Western</option>
                    </select>
                  </div>
                </div>

                <div className="descriptionContainer">
                  <div><label htmlFor="description">DESCRIPTION</label></div>
                  <textarea rows={4} maxLength={120} name="description" placeholder="Enter description..."/>
                </div>

                <div className="buttons">
                  <Link label="CANCEL" className="cancel" onClick={() => setCreatingStory(false)}/>
                  <Link label="NEXT" onClick={() => createStory()}/>
                </div>
              </div>
            </Modal>
          )}
        </div>
    </div>
  );
}

export default withRouter(MyStoriesPage);
