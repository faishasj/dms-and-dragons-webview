import { v4 as uuid } from 'uuid';
import { Step as DBStep } from "../../constants/Types";
import { PreviewFile } from '../../hooks/useFileUpload';



export type Message = DBStep['messages'][0] & {
  id: string; // Attach ID for deleting and updating
  imageFile: PreviewFile | null; // New image file to upload before saving
};
export type Option = DBStep['options'][0] & { id: string }; // Attach ID for deleting and updating
export interface Step extends DBStep {
  messages: Message[];
  options: Option[];
}
export const newMessage = (): Message => ({
  id: uuid(),
  typingTime: 1000,
  waitingTime: 1000,
  image: undefined,
  text: '',
  imageFile: null,
});
export const newOption = (stepId: Step['id']): Option => ({ // Option must point to a next step
  id: uuid(),
  requiredText: '',
  stepId,
});
export const newStep = (root = false): Step => ({
  id: uuid(),
  root,
  options: [],
  messages: [newMessage()], // Must always have 1 message
});

export type StepAction =
  | { type: 'set'; steps: Step[] }
  | { type: 'add'; step: Step; index?: number }
  | { type: 'delete'; step: Step }
  | { type: 'update'; step: Partial<Step> };
export function stepsReducer(state: Step[], action: StepAction) {
  switch (action.type) {
    case 'set': return action.steps;
    case 'add': {
      if (!!action.index || action.index === 0) {
        // Not updating anything else
        return [...state.slice(0, action.index), action.step, ...state.slice(action.index + 1)];
      } else  {
        let newSteps = state.slice();
        if (newSteps.length > 0) { // Link previous step to this step
          const previous = newSteps[newSteps.length - 1];
          newSteps[newSteps.length - 1] = {
            ...previous,
            options: [...previous.options, newOption(action.step.id)],
          };
        }
        newSteps.push(action.step);
        return newSteps;
      }
    }
    case 'delete': {
      const index = state.findIndex(step => step.id === action.step.id);
      if (index === -1) {
        console.warn(`Cannot find step ${action.step.id} to delete`);
        return state;
      }
      let newSteps = [...state.slice(0, index), ...state.slice(index + 1)];
      const previous = index > 0 ? newSteps[index - 1] : null;
      const next = index !== newSteps.length ? newSteps[index] : null;
      if (!!previous) {
        // Remove link in previous step to the now deleted step
        const newOptions = previous.options.filter(op => op.stepId !== action.step.id);
        if (next) newOptions.push(newOption(next.id)); // Add link to what is now the next step
        newSteps[index - 1] = { ...previous, options: newOptions };
      }
      if (index === 0 && !!next) newSteps[0] = { ...newSteps[0], root: true }; // Set new root if root was deleted
      return newSteps;
    }
    case 'update':
      // Please god no updating of links or root
      return state.map(step => step.id === action.step.id ? { ...step, ...action.step } : step);
    default: return state;
  }
}


/** Order steps from the root */
export function traverseSteps(steps: (Step | DBStep)[]): (Step | DBStep)[] {
  const rootStep = steps.find(step => step.root);
  if (!rootStep) return [];
  const orderedSteps = [rootStep];
  let previousSteps = [rootStep];
  for (let i = 1; i < steps.length - 1; i++) {
    const nextSteps = previousSteps.map(prev => (prev.options as any[]) // For all previous steps
      .map(step => steps.find(s => s.id === step.stepId) as Step) // Add the steps linked by all it's options
    ).reduce((a, b) => [...a, ...b], []); // Flatten ( [ [a,b],[c,d] ] -> [a,b,c] )
    if (nextSteps.length === 0) break; // Nothing left. Early exit
    orderedSteps.push(...nextSteps);
    previousSteps = nextSteps;
  }
  return orderedSteps.filter(a => a);
}

/** Parse DBSteps to Steps */
export function parseSteps(steps: DBStep[]): Step[] {
  return steps.map(step => ({
    ...step,
    messages: step.messages.map(message => ({ ...message, id: uuid(), imageFile: null })),
    options: step.options.map(option => ({ ...option, id: uuid() })),
  }));
}

/** Convert Steps to DBSteps */
export function convertSteps(steps: Step[]): DBStep[] {
  return steps.map(step => {
    const messages = step.messages.map(({ id, imageFile, text, image, ...message }) => image ? ({ ...message, image }) : ({ ...message, text }));
    const options = step.options.filter(option => step.options.length === 1 || option.requiredText !== '')
      .map(({ id, ...option }, _, { length: newLength }) => ({
        ...option,
        requiredText: newLength === 1 ? '' : option.requiredText,
      }));
    return { ...step, messages, options };
  });
}

