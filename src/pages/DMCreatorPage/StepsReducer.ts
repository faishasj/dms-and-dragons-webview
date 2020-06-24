import { v4 as uuid } from 'uuid';
import { Step as DBStep } from "../../constants/Types";



export type Message = DBStep['messages'][0] & { id: string }; // Attach ID for deleting and updating
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
  personaId: undefined,
});
export const newOption = (stepId: Step['id']): Option => ({ // Option must point to a next step
  id: uuid(),
  requiredText: 'Any reply',
  stepId,
});
export const newStep = (root = false): Step => ({
  id: uuid(),
  root,
  options: [],
  messages: [newMessage()], // Must always have 1 message
});

export type StepAction =
  | { type: 'add'; step: Step }
  | { type: 'delete'; step: Step }
  | { type: 'update'; step: Partial<Step> };
export function stepsReducer(state: Step[], action: StepAction) {
  switch (action.type) {
    case 'add': {
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
