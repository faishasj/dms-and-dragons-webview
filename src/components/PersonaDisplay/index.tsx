import React from 'react';
import { Persona } from '../../constants/Types';
import './PersonaDisplay.css';


const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ persona, onClick }) => (
  <div className="PersonaDisplay" onClick={onClick}>
    <img className="personaImage" alt="Persona Profile" src={persona.profilePic} />
    <p>{persona.name}</p>
  </div>
);

export interface PersonaDisplayProps {
  persona: Persona;
  onClick?: () => void;
}
export default PersonaDisplay;
