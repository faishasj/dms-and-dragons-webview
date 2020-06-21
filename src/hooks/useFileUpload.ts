import { useDropzone, FileError as RDError, DropzoneOptions } from 'react-dropzone';


function transformFileError({ code, message }: FileError): FileError {
  switch(code) {
    case 'file-invalid-type': return { code, message: 'File must be an image' };
    case 'file-too-large': return { code, message: 'File must be under 10MB' };
    default: return { code, message };
  }
}

export interface PreviewFile extends File { preview: string }
export type FileError = RDError;

const useFileUpload = (
  setFile: (file: PreviewFile) => void,
  setErrors: (errors: FileError[]) => void,
  dropzoneOptions: DropzoneOptions = {},
) => {
  return useDropzone({
    accept: 'image/*',
    maxSize: 10000000, // 10MB
    multiple: false,
    noKeyboard: true,
    noDrag: true,
    onDrop: ([acceptedFile], [rejectedFile]) => {
      if (rejectedFile) {
        setErrors(rejectedFile.errors.map(transformFileError));
        return;
      }
      setErrors([]);
      setFile({ ...acceptedFile, preview: URL.createObjectURL(acceptedFile) });
    },
    ...dropzoneOptions,
  });
};

export default useFileUpload;
