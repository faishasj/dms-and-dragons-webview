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