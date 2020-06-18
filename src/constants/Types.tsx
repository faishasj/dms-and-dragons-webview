import { firestore } from 'firebase';

// App Wide Data Types


// Common Types

export type Uri = string;
export type DateTime = firestore.Timestamp;

// Entities

export interface User {
  id: string;
  name: string;
};

export interface Story {
  id: string;
  authorId: User['id'];
  authorName? :User['name'];
  published: boolean;
  metadata: {
    coverPhoto: Uri;
    description: string;
    failureMessage: string;
    genre: string;
    title: string;
  };
  dateCreated: DateTime;
  datePublished: DateTime;
}