import { firestore } from 'firebase/app';
import { db } from './Firebase';
import { Story, CreateStoryScheme, ProgressCallback, Step } from '../constants/Types';
import { uploadFile, deleteFile } from './Storage';
import { PreviewFile } from '../hooks/useFileUpload';

// Database related Utilities

// Types

export enum Collection {
  Users = 'users',
  Stories = 'stories',
};
export enum SubCollection {
  StoryViews = 'library',
  Steps = 'steps',
};

/** Get Collection Reference */
export const collection = (collectionName: Collection) => db.collection(collectionName);

/** Timestamp right now */
export const newTimestamp = (): firestore.Timestamp => firestore.Timestamp.now();

/** Serialize database entities */
function serialize<T extends { id: string }>(doc: firestore.DocumentSnapshot): T {
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}


export async function getMyStories(authorId: Story['authorId']): Promise<Story[]> {
  const storiesQuery = await collection(Collection.Stories)
                               .where('authorId', '==', authorId)
                               .orderBy('dateUpdated', 'desc').get();
  return storiesQuery.docs.map(doc => serialize<Story>(doc));
}

export async function getLibrary(): Promise<Story[]> {
  const storiesQuery = await collection(Collection.Stories)
                               .where('published', '==', true)
                               .orderBy('dateUpdated', 'desc').get()
  return Promise.all(storiesQuery.docs.map(doc => serialize<Story>(doc))
        .map(async (story) => {
          const author = await db.collection('users').doc(story.authorId).get();
          return { ...story, authorName: author.data()?.name || ''};
        }));
}

export async function newStory(
  authorId: string,
  { title, image, genre, description }: CreateStoryScheme,
  onProgress?: ProgressCallback,
): Promise<Story> {
  const coverPhoto = await uploadFile(image, '/storyCovers', onProgress);
  URL.revokeObjectURL(image.preview);

  const storyData: Partial<Story> = {
    authorId,
    published: false,
    personas: [],
    metadata: { coverPhoto, title, description, genre, failureMessage: 'What was that?' },
    dateCreated: newTimestamp(),
    dateUpdated: newTimestamp(),
  };

  const { id } = await collection(Collection.Stories).add(storyData);

  return { id, ...storyData } as Story;
}

export async function saveStoryWithSteps(story: Story, steps: Step[]) {
  if (story.authorName) delete story.authorName;
  return console.log('SAVE: ', story, steps);
  const storyRef = collection(Collection.Stories).doc(story.id);

  // TODO: Transaction approach
  await Promise.all(steps.map(({ id, ...step }) => storyRef.collection(SubCollection.Steps).doc(id).set(step)));
  await storyRef.update(story);
}

export async function saveStory(
  { id, ...data }: Story,
  newImage?: PreviewFile,
  onProgress?: ProgressCallback,
): Promise<Story> {
  const { coverPhoto } = data.metadata;
  if (newImage) {
    const newPhoto = await uploadFile(newImage, '/storyCovers', onProgress);
    URL.revokeObjectURL(newImage.preview);
    deleteFile(coverPhoto).catch(e => console.warn(e));
    data.metadata.coverPhoto = newPhoto;
  }
  await collection(Collection.Stories).doc(id).set(data);
  return { ...data, id };
}

export async function deleteStory({ id, metadata: { coverPhoto } }: Story): Promise<void> {
  await deleteFile(coverPhoto);
  return collection(Collection.Stories).doc(id).delete();
}
