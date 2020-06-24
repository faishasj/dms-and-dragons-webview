import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Story } from '../../constants/Types';
import { PreviewFile } from '../../hooks/useFileUpload';
import { saveStory, saveStoryWithSteps, getStorySteps, uploadMessageFiles } from '../../lib/Database';

import Header from '../../components/Header';
import Link from '../../components/Link';
import LoadingModal from '../../components/LoadingModal';
import CreateStoryModal from '../../components/CreateStoryModal';
import StepDisplay from './StepDisplay';
import { stepsReducer, newMessage, newStep, Message, Step, Option, newOption, convertSteps, parseSteps, traverseSteps } from './StepsReducer';
import './DMCreatorPage.css';
import Modal from '../../components/Modal';


const DMCreatorPage: React.FC<DMCreatorPageProps> = () => {
  const [steps, dispatch] = useReducer(stepsReducer, []);

  const { state } = useLocation<DMCreatorPageLocData>();
  const { story: initStory } = state || { story: {} };

  const [story, setStory] = useState(initStory);
  const [editingMeta, setEditingMeta] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);

  const { id: storyId } = story || {};
  useEffect(() => {
    if (storyId) 
      setLoading(true);
      getStorySteps(storyId).then(traverseSteps).then(parseSteps).then(steps => dispatch({
        type: 'set',
        steps,
      })).then(() => setLoading(false));
  }, [storyId]);


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

  const updateMessage = useCallback((step: Step, message: Partial<Message>) => {
    dispatch({
      type: 'update',
      step: { ...step, messages: step.messages.map(mess => mess.id === message.id ? { ...mess, ...message } : mess) },
    });
  }, []);

  const addOption = useCallback((step: Step) => {
    dispatch({
      type: 'update',
      step: { ...step, options: [...step.options, newOption(step.id)]}
    })
  }, []);

  const updateOption = useCallback((step: Step, option: Partial<Option>) => {
    dispatch({
      type: 'update',
      step: { ...step, options: step.options.map(opt => opt.id === option.id ? {...opt, ...option} : opt)},
    })
  }, []);

  const deleteOption = useCallback((step: Step, optionId: Option['id']) => {
    const numberOfOptions = step.options.length;
    if (numberOfOptions <= 1) console.warn('Can\'t delete only option');
    else dispatch({
      type: 'update',
      step: { ...step, options: step.options.filter(op => op.id !== optionId) },
    });
  }, []);

  const submit = useCallback(async () => {
    let newSteps: Step[] = steps;
    const imageChanges = steps // { stepId, id, old, new }
      .map(step => step.messages.map(({ id, imageFile, image }) => ({ stepId: step.id, id, newImage: imageFile, oldUrl: image })))
      .reduce((a, b) => [...a, ...b], [])
      .filter(a => a.newImage); // Only interested if there is a new image
    if (imageChanges.length > 0) {
      setLoading(true);
      newSteps = await uploadMessageFiles(storyId, steps, imageChanges as any);
    }
    const data = convertSteps(newSteps);
    await saveStoryWithSteps(story, data);
    dispatch({ type: 'set', steps: newSteps });
    setLoading(false);
  }, [steps, story, storyId]);

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
        {(loading || loadingProgress !== null) && <LoadingModal progress={loadingProgress || undefined} />}
        {!storyId && <Modal><p>No Story</p></Modal>}

        {steps.map((step, i) => (
          <StepDisplay
            key={step.id}
            step={step}
            onNewMessage={addMessage}
            onUpdateMessage={updateMessage}
            onAddOption={addOption}
            onUpdateOption={updateOption}
            onDeleteOption={deleteOption}
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