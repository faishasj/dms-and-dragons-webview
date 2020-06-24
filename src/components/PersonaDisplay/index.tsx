import React from 'react';
import { Persona } from '../../constants/Types';
import './PersonaDisplay.css';


const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ persona }) => (
  <div className="PersonaDisplay">
    <img className="personaImage" alt="Persona Profile" src={persona.profilePic} />
    <p>{persona.name}</p>
  </div>
);

export interface PersonaDisplayProps {
  persona: Persona;
}
export default PersonaDisplay;
