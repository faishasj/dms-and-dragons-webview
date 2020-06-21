import { firestore } from 'firebase/app';
import { db } from './Firebase';
import { Story } from '../constants/Types';


function serialize<T extends { id: string }>(doc: firestore.DocumentSnapshot): T {
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

export async function getMyStories(authorId: Story['authorId']): Promise<Story[]> {
  const storiesQuery = await db.collection('stories')
                               .where('authorId', '==', authorId)
                               .orderBy('dateUpdated', 'desc').get();
  return storiesQuery.docs.map(doc => serialize<Story>(doc));
}

export async function getLibrary(): Promise<Story[]> {
  const storiesQuery = await db.collection('stories')
                               .where('published', '==', true)
                               .orderBy('dateUpdated', 'desc').get()
  return Promise.all(storiesQuery.docs.map(doc => serialize<Story>(doc))
        .map(async (story) => {
          const author = await db.collection('users').doc(story.authorId).get();
          return { ...story, authorName: author.data()?.name || ''};
        }));
}

export async function newStory(story: Story): Promise<void> {
  return db.collection('stories').doc(story.id).set({})
}

export async function deleteStory(storyId: Story['id']): Promise<void> {
  return db.collection('stories').doc(storyId).delete();
}