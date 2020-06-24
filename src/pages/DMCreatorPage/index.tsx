import React, { useState, useReducer, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { Story } from '../../constants/Types';
import { PreviewFile } from '../../hooks/useFileUpload';
import { saveStory, saveStoryWithSteps } from '../../lib/Database';

import Header from '../../components/Header';
import Link from '../../components/Link';
import LoadingModal from '../../components/LoadingModal';
import CreateStoryModal from '../../components/CreateStoryModal';
import StepDisplay from './StepDisplay';
import { stepsReducer, newMessage, newStep, Message, Step, Option } from './StepsReducer';
import './DMCreatorPage.css';


const DMCreatorPage: React.FC<DMCreatorPageProps> = () => {
  const [steps, dispatch] = useReducer(stepsReducer, []);

  const { state: { story: initStory } } = useLocation<DMCreatorPageLocData>();

  const [story, setStory] = useState(initStory);
  const [editingMeta, setEditingMeta] = useState<Boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);


  const addStep = useCallback(() => {
    const root = steps.length <= 0;

    dispatch({ type: 'add', step: newStep(root) });
  }, [steps]);

  const addMessage = useCallback(() => {
    if (steps.length === 0) return addStep();
    const step = steps[steps.length - 1];
    dispatch({
      type: 'update',
      step: { ...step, messages: [...step.messages, newMessage()] },
    })
  }, [steps, addStep]);

  const deleteMessage = useCallback((step: Step, messageId: Message['id']) => {
    const numberOfMessages = step.messages.length;
    if (numberOfMessages === 1) dispatch({ type: 'delete', step });
    else dispatch({
      type: 'update',
      step: { ...step, messages: step.messages.filter(mess => mess.id !== messageId) },
    });
  }, []);

  const deleteOption = useCallback((step: Step, optionId: Option['id']) => {
    const numberOfOptions = step.messages.length;
    if (numberOfOptions > 1) console.warn('Can\'t delete only option');
    else dispatch({
      type: 'update',
      step: { ...step, options: step.options.filter(op => op.id !== optionId) },
    });
  }, []);

  const updateMessage = useCallback((step: Step, message: Partial<Message>) => {
    dispatch({
      type: 'update',
      step: { ...step, messages: step.messages.map(mess => mess.id === message.id ? { ...mess, ...message } : mess) },
    });
  }, []);

  const submit = useCallback(() => {
    const data = steps.map(step => {
      const messages = step.messages.map(({ id, ...message }) => message);
      const options = step.options.map(({ id, ...option }) => option);
      return { ...step, messages, options };
    });
    saveStoryWithSteps(story, data);
  }, [steps, story]);

  const editStory = useCallback(async (story: Story, newImage?: PreviewFile) => {
    setEditingMeta(false);
    const newStory = await saveStory(story, newImage, (progress) => setLoadingProgress(progress));
    setStory(newStory);
    setLoadingProgress(null);
  }, [setLoadingProgress]);


  return (
    <div className="DMCreatorPage">
      <Header pageTitle="DM Creator" settingsCallback={() => setEditingMeta(true)}/>
      <div className="container">
        {loadingProgress !== null && <LoadingModal progress={loadingProgress} />}

        {steps.map((step, i) => (
          <StepDisplay
            key={step.id}
            step={step}
            onNewMessage={addMessage}
            onUpdateMessage={updateMessage}
          />
        ))}

        <div className="row">
          <div className="rowOption" onClick={addMessage}>+ ADD MESSAGE</div>
          <div className="rowOption" onClick={addStep}>+ ADD REPLY</div>
        </div>

       {editingMeta && (
        <CreateStoryModal 
          onDismiss={() => setEditingMeta(false)} 
          onEdit={editStory} 
          story={ story }/>
      )}
      </div>
      <div className="toolbar"><Link label="Save" onClick={submit} /></div>
    </div>
  );
};

export interface DMCreatorPageLocData { story: Story }
export interface DMCreatorPageProps {}

export default DMCreatorPage;