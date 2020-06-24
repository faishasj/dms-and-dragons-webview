import React, { useState, useReducer, useCallback } from 'react';

import { Story } from '../../constants/Types';

import { saveStory } from '../../lib/Database';
import Header from '../../components/Header';
import StepDisplay from './StepDisplay';
import Link from '../../components/Link';
import { stepsReducer, newMessage, newStep, Message, Step, Option } from './StepsReducer';
import CreateStoryModal from '../../components/CreateStoryModal';
import './DMCreatorPage.css';


const DMCreatorPage: React.FC<DMCreatorPageProps> = ({ story }) => {
  const [steps, dispatch] = useReducer(stepsReducer, []);

  const [editingMeta, setEditingMeta] = useState<Boolean>(false);

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
    console.log('SAVE: ', data);
    // saveStory(story, data);
  }, [steps]);

  console.log(steps);
  return (
    <div className="DMCreatorPage">
      <Header pageTitle="DM Creator" settingsCallback={() => setEditingMeta(true)}/>
      <div className="container">
        {steps.map((step, i) => (
          <StepDisplay
            key={`${JSON.stringify(step)} - ${i}`}
            step={step}
            onNewMessage={addMessage}
            onUpdateMessage={updateMessage}
          />
        ))}
        <div className="row">
          <div className="rowOption" onClick={addMessage}>+ ADD MESSAGE</div>
          <div className="rowOption" onClick={addStep}>+ ADD REPLY</div>
        </div>

       { editingMeta && (
        <CreateStoryModal 
          onDismiss={() => setEditingMeta(false)} 
          onEdit={() => {}} 
          story={ story }/>
      )}
      </div>
      <div className="toolbar"><Link label="Save" onClick={submit} /></div>
    </div>
  );
};

export interface DMCreatorPageProps {
  story: Story
}

export default DMCreatorPage;