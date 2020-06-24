import React, { useState, useCallback } from 'react';
import FacebookUser from '../../assets/facebook-user.jpg';
import { Persona } from '../../constants/Types';
import useFileUpload, { PreviewFile, FileError } from '../../hooks/useFileUpload';
import Link from '../Link';
import './PersonaDisplay.css';


const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ persona, onClick, onSubmitPersona }) => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<PreviewFile | null>(null);

  const [errors, setErrors] = useState<FileError[]>([]);

  const submitPersona = useCallback(() => {
    const newErrors = [];
    if (!name) newErrors.push({ code: 'no-name', message: 'Must include name' });
    if (!imageFile) newErrors.push({ code: 'no-image', message: 'Must include profile picture' });
    if (newErrors.length === 0) onSubmitPersona?.(name, imageFile!);
    setErrors(newErrors);
  }, [name, imageFile, onSubmitPersona]);

  const { getRootProps, getInputProps } = useFileUpload(setImageFile, setErrors, {
    maxSize: 8000000 // Facebook limit is 8MB
  });

  if (persona) return (
    <div className="PersonaDisplay" onClick={onClick}>
      <img className="personaImage" alt="Persona Profile" src={persona.profilePic} />
      <p>{persona.name}</p>
    </div>
  );

  return (
    <div className="EditPersonaDisplay" onClick={onClick}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <img className="personaImage" alt="Persona Profile" src={imageFile?.preview || FacebookUser} />
        {errors.map(error => <p className="errorText" key={error.code}>{error.message}</p>)}
      </div>
      <input type="text" placeholder="Persona Name" onChange={e => setName(e.target.value)} />
      <Link label="Create" onClick={submitPersona} />
    </div>
  );
};

export interface PersonaDisplayProps {
  persona?: Persona;
  onClick?: () => void;
  onSubmitPersona?: (name: string, imageFile: PreviewFile) => void;
}
export default PersonaDisplay;
