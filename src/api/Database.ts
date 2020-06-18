import { firestore } from 'firebase';
import { db } from './Firebase';
import { Story } from '../constants/Types';


function serialize(doc: firestore.DocumentSnapshot): any {
  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function getMyStories(authorId: Story['id']): Promise<Story[]> {
  const storiesQuery = await db.collection('stories')
                               .where('authorId', '==', authorId)
                               .orderBy('dateUpdated', 'desc').get();
  return storiesQuery.docs.map(doc => serialize(doc));
}

export async function getLibrary(): Promise<Story[]> {
  const storiesQuery = await db.collection('stories')
                               .where('published', '==', true)
                               .orderBy('dateUpdated', 'desc').get()
  return Promise.all(storiesQuery.docs.map(doc => serialize(doc) as Story)
        .map(async (story) => {
          const author = await db.collection('users').doc(story.authorId).get();
          return { ...story, authorName: author.data()?.name || ''};
        }));
}