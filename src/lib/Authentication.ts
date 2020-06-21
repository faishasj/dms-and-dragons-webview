import { auth } from './Firebase';


export const signInAnon = () => auth.signInAnonymously();


export default {
  signInAnon,
};
