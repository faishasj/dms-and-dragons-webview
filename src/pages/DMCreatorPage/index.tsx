import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Story, Persona } from '../../constants/Types';
import { PreviewFile } from '../../hooks/useFileUpload';
import { saveStory, saveStoryWithSteps, getStorySteps, uploadMessageFiles, createPersona } from '../../lib/Database';

import Header from '../../components/Header';
import Link from '../../components/Link';
import Modal from '../../components/Modal';
import LoadingModal from '../../components/LoadingModal';
import CreateStoryModal from '../../components/CreateStoryModal';
import PersonaDisplay from '../../components/PersonaDisplay';
import StepDisplay from './StepDisplay';
import { stepsReducer, newMessage, newStep, Message, Step, Option, newOption, convertSteps, parseSteps, traverseSteps, displaySteps } from './StepsReducer';
import './DMCreatorPage.css';


const DMCreatorPage: React.FC<DMCreatorPageProps> = () => {
  const [steps, dispatch] = useReducer(stepsReducer, []);

  const { state } = useLocation<DMCreatorPageLocData>();
  const { story: initStory } = state || { story: {} };

  const [story, setStory] = useState(initStory);
  const [editingMeta, setEditingMeta] = useState<boolean>(false);
  const [messageAddingPersona, setMessageAddingPersona] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);

  const { id: storyId, personas } = story || {};
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
    const newChildStep = newStep();

    dispatch({
      type: 'add',
      index: steps.findIndex(s => s.id === step.id),
      step: { ...newChildStep, options: [newOption(step.options[0].stepId)] }
    })

    if (step.options.length === 1) {
      const newFirstStep = newStep();
      dispatch({
        type: 'add',
        index: steps.findIndex(s => s.id === step.id),
        step: { ...newFirstStep, options: [newOption(step.options[0].stepId)] }
      })

      dispatch({
        type: 'update',
        step: { ...step, options: [newOption(newFirstStep.id), newOption(newChildStep.id)]}
      });
    } else {
      dispatch({
        type: 'update',
        step: { ...step, options: [...step.options, {...newOption(newChildStep.id)}]}
      });
    }
  }, [steps]);

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
    setLoading(true);
    if (imageChanges.length > 0) newSteps = await uploadMessageFiles(storyId, steps, imageChanges as any);
    const data = convertSteps(newSteps);
    await Promise.all([saveStoryWithSteps(story, data), new Promise(resolve => setTimeout(resolve, 1000))]); // At least a second waiting
    dispatch({ type: 'set', steps: parseSteps(data) }); // Parsing again to reset fields
    setLoading(false);
  }, [steps, story, storyId]);

  const editStory = useCallback(async (story: Story, newImage?: PreviewFile) => {
    setEditingMeta(false);
    const newStory = await saveStory(story, newImage, (progress) => setLoadingProgress(progress));
    setStory(newStory);
    setLoadingProgress(null);
  }, [setLoadingProgress]);

  const setPersona = useCallback((persona?: Persona) => {
    const { id: personaId } = persona || { id: '' };
    const step = steps.find(s => s.messages.map(m => m.id).includes(messageAddingPersona?.id || ''));
    if (!step) return console.warn('Couldn\'t find step where persona adding message lives');
    dispatch({
      type: 'update',
      step: {
        ...step,
        messages: step.messages.map(mess => mess.id === messageAddingPersona?.id ? { ...mess, personaId } : mess)
      }
    });
    setMessageAddingPersona(null);
  }, [messageAddingPersona, steps]);

  const newPersona = useCallback(async (name: string, imageFile: PreviewFile) => {
    setEditingMeta(false);
    setLoading(true);
    const persona = await createPersona(story, name, imageFile);
    setStory({ ...story, personas: [...story.personas, persona] });
    setLoading(false);
  }, [story]);


  return (
    <div className="DMCreatorPage">
      <Header pageTitle="DM Creator" settingsCallback={() => setEditingMeta(true)}/>
      <div className="container">
        {(loading || loadingProgress !== null) && <LoadingModal progress={loadingProgress || undefined} />}
        {!storyId && <Modal><p>No Story</p></Modal>}

        {displaySteps(steps).map((step, i, array) => (
          <StepDisplay
            key={step.id}
            step={step}
            personas={personas}
            isBranch={i > 0 && array[i-1].options.length > 1}
            onNewMessage={addMessage}
            onUpdateMessage={updateMessage}
            onAddOption={addOption}
            onUpdateOption={updateOption}
            onDeleteOption={deleteOption}
            onEditPersona={setMessageAddingPersona}
            onSetBranch={(step, option) => dispatch({ type: 'update', step: { ...step, branch: option.stepId }})}
          />
        ))}

        <div className="row">
          <div className="rowOption" onClick={addMessage}>+ ADD MESSAGE</div>
          <div className="rowOption" onClick={addStep}>+ ADD REPLY</div>
        </div>

       {editingMeta && (
        <CreateStoryModal 
          onDismiss={() => setEditingMeta(false)} 
          onSubmitPersona={newPersona}
          onEdit={editStory} 
          story={ story }
        />
      )}
      {!!messageAddingPersona && (
        <Modal>
          <h3>Choose Persona</h3>
          {personas.map(persona => <PersonaDisplay key={persona.id} persona={persona} onClick={() => setPersona(persona)} />)}
          <div className="row">
            <Link label="Close" onClick={() => setMessageAddingPersona(null)} />
            <Link className="cancelButton" label="Remove" onClick={() => setPersona()} />
          </div>
        </Modal>
      )}
      </div>
      <div className="toolbar"><Link label="SAVE STORY" onClick={submit} /></div>
    </div>
  );
};

export interface DMCreatorPageLocData { story: Story }
export interface DMCreatorPageProps {}

export default DMCreatorPage;