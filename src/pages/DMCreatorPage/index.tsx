import React, { useReducer, useCallback } from 'react';

import Header from '../../components/Header';
import StepDisplay from './StepDisplay';
import CircleButton from '../../components/CircleButton';
import { stepsReducer, newMessage, newStep, Message, Step, Option } from './StepsReducer';
import './DMCreatorPage.css';


const DMCreatorPage: React.FC<DMCreatorPageProps> = ({ storyID }) => {
  const [steps, dispatch] = useReducer(stepsReducer, []);

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

  console.log(steps);
  return (
    <div className="DMCreatorPage">
      <Header pageTitle="DM Creator"/>
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
          <CircleButton icon="➕" onClick={addMessage} />
          <CircleButton icon="➕" onClick={addStep} />
        </div>
      </div>
    </div>
  );
};

export interface DMCreatorPageProps {
  storyID?: string
}

export default DMCreatorPage;