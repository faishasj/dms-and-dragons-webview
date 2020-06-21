import Firebase from 'firebase/app';
import { storage } from './Firebase';
import { signInAnon } from './Authentication';



export const uploadFile = async (
  file: File,
  storagePath = '',
  onProgress?: (progress: number, transferred: number, total: number) => void,
): Promise<string> => {

  await signInAnon();

  const uploadTask = storage.ref(storagePath).child(file.name).put(file);

  uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, ({ bytesTransferred, totalBytes }) => {
    const progress = (bytesTransferred / totalBytes) * 100;
    console.log(progress);
    if (onProgress) onProgress(progress, bytesTransferred, totalBytes);
  });

  const finalSnapshot = await uploadTask;
  return finalSnapshot.ref.getDownloadURL();
}