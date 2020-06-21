import { firestore } from 'firebase/app';
import { db } from './Firebase';
import { Story, CreateStoryScheme } from '../constants/Types';
import { uploadFile } from './Storage';

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

export async function newStory(authorId: string, { title, image, genre, description }: CreateStoryScheme): Promise<Story> {
  const coverPhoto = await uploadFile(image, '/storyCovers');

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

export async function deleteStory(storyId: Story['id']): Promise<void> {
  return collection(Collection.Stories).doc(storyId).delete();
}